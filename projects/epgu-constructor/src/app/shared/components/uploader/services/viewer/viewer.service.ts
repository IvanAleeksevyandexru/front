import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { ModalService } from '../../../../../modal/modal.service';
import { UploaderViewerComponent } from '../../components/uploader-viewer/uploader-viewer.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

import { FilesCollection, SuggestAction } from '../../data';
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

  selectedSuggest: Observable<FileItem | null> = combineLatest([
    this.selectedSuggestsIndex,
    this.suggests,
  ]).pipe(map(this.fileSelector.bind(this)));
  selectedFile: Observable<FileItem | null> = combineLatest([
    this.selectedFilesIndex,
    this.files,
  ]).pipe(map(this.fileSelector.bind(this)));

  type: FilesCollection;

  constructor(private modal: ModalService) {}

  getSelectedFileByType(): Observable<FileItem | null> {
    return this.type === FilesCollection.suggest ? this.selectedSuggest : this.selectedFile;
  }

  fileSelector([index, collection]: [number, FileItem[]]): FileItem | null {
    const item = collection[index];
    if (!item) {
      return null;
    }
    return collection[index];
  }

  setDescription(text: string): void {
    this.description.next(text);
  }

  prev(): void {
    const selectedIndexSubject = this.getSelectedIndexByType();
    const collection = this.getCollectionByType().getValue();
    const selectedIndex = selectedIndexSubject.getValue();
    selectedIndexSubject.next((selectedIndex === 0 ? collection.length : selectedIndex) - 1);
    console.log(selectedIndexSubject.getValue());
  }

  next(): void {
    const selectedIndexSubject = this.getSelectedIndexByType();
    const collection = this.getCollectionByType().getValue();
    const selectedIndex = selectedIndexSubject.getValue();
    selectedIndexSubject.next(selectedIndex === collection.length - 1 ? 0 : selectedIndex + 1);
    console.log(selectedIndexSubject.getValue());
  }

  changeSelectedIndexById(id: string): void {
    const index = this.getSelectedIndexById(id);
    const selectedIndex = this.getSelectedIndexByType();
    if (this.type === FilesCollection.suggest) {
      this.selectedSuggestId = id;
    } else {
      this.selectedFilesId = id;
    }
    selectedIndex.next(index !== -1 ? index : 0);
  }

  getSelectedIndexByType(): BehaviorSubject<number> {
    return this.type === FilesCollection.suggest
      ? this.selectedSuggestsIndex
      : this.selectedFilesIndex;
  }

  getCollectionByType(): BehaviorSubject<FileItem[]> {
    return this.type === FilesCollection.suggest ? this.suggests : this.files;
  }

  getSelectedIndexById(id: string): number {
    const collection = this.getCollectionByType().getValue();
    return collection.findIndex((item) => item.id === id);
  }

  update(type: FilesCollection, items: FileItem[]): void {
    this.type = type;
    const collection = this.getCollectionByType();
    collection.next([...items]);
    this.updateIndexByType();
  }

  updateIndexByType(): void {
    const id =
      this.type === FilesCollection.suggest ? this.selectedSuggestId : this.selectedFilesId;
    this.changeSelectedIndexById(id);
  }

  open(type: FilesCollection, id?: string, collection?: FileItem[]): Observable<void> {
    this.type = type;
    if (collection) {
      this.update(type, collection);
    }
    if (id) {
      this.changeSelectedIndexById(id);
    }
    return this.isOpen.getValue()
      ? of(null)
      : of({
          type,
          item: this.getSelectedFileByType(),
        }).pipe(
          tap(() => this.isOpen.next(true)),
          map((params) => this.modal.createModal(UploaderViewerComponent, params)),
          map((modal) => this.addDetachToModal(modal)),
          mergeMap((modal) => this.observeOutputs(modal)),
          finalize(() => this.isOpen.next(false)),
          takeUntil(this.result),
        );
  }

  observeOutputs<T extends UploaderViewerComponent>(modal: ComponentRef<T>): Observable<void> {
    return combineLatest([
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
        filter((deleteEvent) => !!deleteEvent),
        tap(() => this.prev()),
      ),
      modal.instance.next.pipe(
        startWith(null),
        filter((deleteEvent) => !!deleteEvent),
        tap(() => this.next()),
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
