import { ApplicationRef, ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { ModalService } from '../../../../../modal/modal.service';
import { UploaderViewerComponent } from '../../components/uploader-viewer/uploader-viewer.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

import { SuggestAction } from '../../data';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, finalize, map, mergeMap, startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class ViewerService {
  delete = new EventEmitter<FileItem>();
  download = new EventEmitter<FileItem>();
  suggest = new EventEmitter<SuggestAction>();

  isOpen = new BehaviorSubject<boolean>(false);
  result = new Subject<null>();

  constructor(private modal: ModalService, private appRef: ApplicationRef) {}

  open(
    selectedId: string,
    files: FileItem[],
    isSuggest: boolean,
    suggests: FileItem[] = [],
  ): Observable<void> {
    return this.isOpen.getValue()
      ? of(null)
      : of({
          isSuggest,
          files,
          suggests,
          selectedId,
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
    ]).pipe(map(() => undefined));
  }

  addDetachToModal<T extends UploaderViewerComponent>(modal: ComponentRef<T>): ComponentRef<T> {
    modal.instance.detachView = (): void => {
      this.appRef.detachView(modal.hostView);
      this.result.next(null);
    };
    return modal;
  }
}
