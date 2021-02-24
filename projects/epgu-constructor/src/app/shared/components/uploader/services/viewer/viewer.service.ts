import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { ModalService } from '../../../../../modal/modal.service';
import { UploaderViewerComponent } from '../../components/uploader-viewer/uploader-viewer.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

import { FilesCollection, SuggestAction, ViewerInfo } from '../../data';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, finalize, map, mergeMap, startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class ViewerService {
  delete = new EventEmitter<FileItem>();
  download = new EventEmitter<FileItem>();
  suggest = new EventEmitter<SuggestAction>();

  isOpen = new BehaviorSubject<boolean>(false);
  result = new Subject<null>();

  files = new BehaviorSubject<FileItem[]>([]);
  suggests = new BehaviorSubject<FileItem[]>([]);

  selectedFilesId: string;
  selectedSuggestId: string;
  selectedFilesIndex = new BehaviorSubject<number>(0);
  selectedSuggestsIndex = new BehaviorSubject<number>(0);
  description = new BehaviorSubject<string>('');

  selectedSuggest: Observable<ViewerInfo | null> = combineLatest([
    this.selectedSuggestsIndex,
    this.suggests,
  ]).pipe(map(this.fileSelector.bind(this)));
  selectedFile: Observable<ViewerInfo | null> = combineLatest([
    this.selectedFilesIndex,
    this.files,
  ]).pipe(map(this.fileSelector.bind(this)));

  constructor(private modal: ModalService) {}

  getSelectedFileByType(type: FilesCollection): Observable<ViewerInfo | null> {
    return type === FilesCollection.suggest ? this.selectedSuggest : this.selectedFile;
  }

  fileSelector([index, collection]: [number, FileItem[]]): ViewerInfo | null {
    const item = collection[index];
    if (!item) {
      return null;
    }
    return {
      size: collection.length,
      position: index + 1,
      file: collection[index],
    };
  }

  setDescription(text: string): void {
    this.description.next(text);
  }

  updateIdbyIndex(type: FilesCollection): void {
    const collection = this.getCollectionByType(type).getValue();
    const selectedIndex = this.getSelectedIndexByType(type).getValue();
    if (type === FilesCollection.suggest) {
      this.selectedSuggestId = collection[selectedIndex].id;
    } else {
      this.selectedFilesId = collection[selectedIndex].id;
    }
  }

  prev(type: FilesCollection): void {
    const selectedIndexSubject = this.getSelectedIndexByType(type);
    const collection = this.getCollectionByType(type).getValue();
    const selectedIndex = selectedIndexSubject.getValue();
    selectedIndexSubject.next((selectedIndex === 0 ? collection.length : selectedIndex) - 1);
    this.updateIdbyIndex(type);
  }

  next(type: FilesCollection): void {
    const selectedIndexSubject = this.getSelectedIndexByType(type);
    const collection = this.getCollectionByType(type).getValue();
    const selectedIndex = selectedIndexSubject.getValue();
    selectedIndexSubject.next(selectedIndex === collection.length - 1 ? 0 : selectedIndex + 1);
    this.updateIdbyIndex(type);
  }

  changeSelectedIndexById(id: string, type: FilesCollection): void {
    const index = this.getSelectedIndexById(id, type);
    const selectedIndex = this.getSelectedIndexByType(type);
    if (type === FilesCollection.suggest) {
      this.selectedSuggestId = id;
    } else {
      this.selectedFilesId = id;
    }
    selectedIndex.next(index !== -1 ? index : 0);
  }

  getSelectedIndexByType(type: FilesCollection): BehaviorSubject<number> {
    return type === FilesCollection.suggest ? this.selectedSuggestsIndex : this.selectedFilesIndex;
  }

  getCollectionByType(type: FilesCollection): BehaviorSubject<FileItem[]> {
    return type === FilesCollection.suggest ? this.suggests : this.files;
  }

  getSelectedIndexById(id: string, type: FilesCollection): number {
    const collection = this.getCollectionByType(type).getValue();
    return collection.findIndex((item) => item.id === id);
  }

  update(type: FilesCollection, items: FileItem[]): void {
    const collection = this.getCollectionByType(type);
    collection.next([...items]);
    this.updateIndexByType(type);
  }

  updateIndexByType(type: FilesCollection): void {
    const id = type === FilesCollection.suggest ? this.selectedSuggestId : this.selectedFilesId;
    this.changeSelectedIndexById(id, type);
  }

  open(type: FilesCollection, id?: string, collection?: FileItem[]): Observable<void> {
    if (collection) {
      this.update(type, collection);
    }
    if (id) {
      this.changeSelectedIndexById(id, type);
    }
    return this.isOpen.getValue()
      ? of(null)
      : of({
          type,
        }).pipe(
          tap(() => this.isOpen.next(true)),
          map((params) => this.modal.createModal(UploaderViewerComponent, params)),
          map((modal) => this.addDetachToModal(modal)),
          mergeMap((modal) => this.observeOutputs(modal, type)),
          finalize(() => this.isOpen.next(false)),
          takeUntil(this.result),
        );
  }

  observeOutputs<T extends UploaderViewerComponent>(
    modal: ComponentRef<T>,
    type: FilesCollection,
  ): Observable<void> {
    return combineLatest([
      this.getCollectionByType(type).pipe(
        tap((collection) => {
          if (collection.length === 0) {
            modal.instance.closeModal();
          }
        }),
      ),
      modal.instance.suggest.pipe(
        startWith(null),
        filter((sudjectEvent) => !!sudjectEvent),
        tap((sudjectEvent) => this.suggest.emit(sudjectEvent)),
      ),
      modal.instance.download.pipe(
        startWith(null),
        filter((downloadEvent) => !!downloadEvent),
        tap((downloadEvent) => this.download.emit(downloadEvent)),
      ),
      modal.instance.delete.pipe(
        startWith(null),
        filter((deleteEvent) => !!deleteEvent),
        tap((deleteEvent) => this.delete.emit(deleteEvent)),
      ),
      modal.instance.prev.pipe(
        startWith(null),
        filter((prevEvent) => !!prevEvent),
        tap((type: FilesCollection) => this.prev(type)),
      ),
      modal.instance.next.pipe(
        startWith(null),
        filter((nextEvent) => !!nextEvent),
        tap((type: FilesCollection) => this.next(type)),
      ),
    ]).pipe(map(() => undefined));
  }

  addDetachToModal<T extends UploaderViewerComponent>(modal: ComponentRef<T>): ComponentRef<T> {
    modal.instance.detachView = (): void => {
      modal.destroy();
      this.result.next(null);
    };
    return modal;
  }
}
