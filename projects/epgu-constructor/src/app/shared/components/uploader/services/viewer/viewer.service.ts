import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { ModalService } from '../../../../../modal/modal.service';
import { UploaderViewerComponent } from '../../components/uploader-viewer/uploader-viewer.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

import { FilesCollection, SuggestAction, ViewerInfo } from '../../data';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, finalize, map, mergeMap, startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class ViewerService {
  isOpen = new BehaviorSubject<boolean>(false);
  result = new Subject<null>();

  constructor(private modal: ModalService) {}

  open(
    type: FilesCollection,
    id: string,
    collection$: Observable<FileItem[]>,
    suggest?: EventEmitter<SuggestAction>,
    remove?: EventEmitter<FileItem>,
    download?: EventEmitter<FileItem>,
  ): Observable<void> {
    const selectedIndex = new BehaviorSubject<number>(null);

    return this.isOpen.getValue()
      ? of(null)
      : of({
          type,
        }).pipe(
          tap(() => this.isOpen.next(true)),
          map((params) => this.modal.createModal(UploaderViewerComponent, params)),
          map((modal) => this.addDetachToModal(modal)),
          mergeMap((modal) =>
            this.observeOutputs(modal, selectedIndex, id, collection$, suggest, remove, download),
          ),
          finalize(() => this.isOpen.next(false)),
          takeUntil(this.result),
        );
  }

  closeForEmpty<T extends UploaderViewerComponent>(
    collection: FileItem[],
    modal: ComponentRef<T>,
  ): void {
    if (collection.length === 0) {
      modal.instance.closeModal();
    }
  }
  updateFile<T extends UploaderViewerComponent>(item, modal: ComponentRef<T>): void {
    modal.instance.item = item;
  }

  getSelectedIndexById(id: string, collection: FileItem[]): number {
    return collection.findIndex((item) => item.id === id);
  }

  getFile(index: number, collection: FileItem[]): ViewerInfo | null {
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

  getIndex(id: string, collection: FileItem[]): number {
    const index = this.getSelectedIndexById(id, collection);
    return index !== -1 ? index : 0;
  }

  checkIndex(
    collection: FileItem[],
    index: number,
    selectedIndex$: BehaviorSubject<number>,
    id: string,
  ): boolean {
    let nextIndex: number;
    let result = true;

    if (index === null) {
      // Когда открываем в 1 раз. Определяем index по id.
      nextIndex = this.getIndex(id, collection);
      result = false;
    } else if (index < 0) {
      // Prev Event может установить index в -1 - тогда меняем index на последний элемент
      nextIndex = collection.length - 1;
      result = false;
    } else if (index > collection.length - 1 || !collection[index]) {
      // Next Event может установить index больше чем есть в списке
      // или нет элемента по индексу - тогда меняем index на первый элемент
      nextIndex = 0;
      result = false;
    } else {
      nextIndex = index;
    }
    if (nextIndex !== index) {
      selectedIndex$.next(nextIndex);
    }
    return result;
  }

  observeOutputs<T extends UploaderViewerComponent>(
    modal: ComponentRef<T>,
    selectedIndex$: BehaviorSubject<number>,
    selectedId: string,
    collection$: Observable<FileItem[]>,
    suggest?: EventEmitter<SuggestAction>,
    remove?: EventEmitter<FileItem>,
    download?: EventEmitter<FileItem>,
  ): Observable<void> {
    return combineLatest([
      combineLatest([collection$, selectedIndex$]).pipe(
        tap(([collection]) => this.closeForEmpty(collection, modal)),
        filter(([collection, index]) =>
          this.checkIndex(collection, index, selectedIndex$, selectedId),
        ),
        map(([collection, index]: [FileItem[], number]) => this.getFile(index, collection)),
        tap((item) => this.updateFile(item, modal)),
      ),
      modal.instance.suggest.pipe(
        startWith(null),
        filter((sudjectEvent) => !!sudjectEvent),
        tap((sudjectEvent) => suggest?.emit(sudjectEvent)),
      ),
      modal.instance.download.pipe(
        startWith(null),
        filter((downloadEvent) => !!downloadEvent),
        tap((downloadEvent) => download?.emit(downloadEvent)),
      ),
      modal.instance.delete.pipe(
        startWith(null),
        filter((deleteEvent) => !!deleteEvent),
        tap((deleteEvent) => remove?.emit(deleteEvent)),
      ),
      modal.instance.prev.pipe(
        startWith(null),
        filter((prevEvent) => !!prevEvent),
        tap(() => selectedIndex$.next(selectedIndex$.getValue() - 1)),
      ),
      modal.instance.next.pipe(
        startWith(null),
        filter((nextEvent) => !!nextEvent),
        tap(() => selectedIndex$.next(selectedIndex$.getValue() + 1)),
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
