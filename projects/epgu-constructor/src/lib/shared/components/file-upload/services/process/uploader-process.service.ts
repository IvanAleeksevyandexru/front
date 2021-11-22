import { Injectable } from '@angular/core';
import {
  ErrorActions,
  FileItem,
  FileItemStatus,
  Operation,
  OperationHandler,
  OperationType,
  UPLOAD_OBJECT_TYPE,
} from '../../data';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';

import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mapTo,
  mergeMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { Observable } from 'rxjs/internal/Observable';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderManagerService } from '../manager/uploader-manager.service';
import { UploaderStatService } from '../stat/uploader-stat.service';
import { UploaderValidationService } from '../validation/uploader-validation.service';
import { UploadedFile } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';

@Injectable()
export class UploaderProcessService {
  operations: Record<string, Operation> = {};
  counter = new BehaviorSubject<number>(0);
  processing$ = this.counter.pipe(
    map((counter) => counter > 0),
    distinctUntilChanged(),
  );

  stream = new Subject<Operation>();
  stream$ = this.stream.pipe(
    tap(() => this.increment()),
    mergeMap((operation: Operation) => {
      const { item, handler, type } = operation;
      const { status: fileStatus } = item;
      const id = this.getOperationId(type, item);

      if (this.operations[id]) {
        return of(undefined);
      }
      this.operations[id] = operation;
      return handler(operation, fileStatus).pipe(
        catchError(() => of(undefined)),
        finalize(() => {
          delete this.operations[id];
          this.decrement();
        }),
      );
    }),
  );

  constructor(
    private api: TerraByteApiService,
    private store: UploaderStoreService,
    private uploader: UploaderManagerService,
    private stat: UploaderStatService,
    private validation: UploaderValidationService,
  ) {}

  increment(): void {
    this.counter.next(this.counter.getValue() + 1);
  }

  decrement(): void {
    this.counter.next(this.counter.getValue() - 1);
  }

  createOperation(type: OperationType, item: FileItem, handler: OperationHandler): void {
    const operation = {
      type,
      item,
      handler,
      cancel: new BehaviorSubject<boolean>(false),
    } as Operation;
    this.stream.next(operation);
  }

  getOperationId(type: OperationType, item: FileItem): string {
    return `${type}${item.id}`;
  }

  upload(file: FileItem): void {
    this.createOperation(OperationType.upload, file, this.uploadOperation.bind(this));
  }

  uploadOperation({ item, cancel }: Operation, oldStatus: FileItemStatus): Observable<void> {
    const options = item.createUploadOptions(
      this.uploader.objectId,
      UPLOAD_OBJECT_TYPE,
      this.uploader.getMnemonic(),
    );

    return of(item).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.uploading)),
      tap((file: FileItem) => this.stat.incrementLimits(file)),
      concatMap((file) => this.api.uploadFile(options, file.raw)),
      catchError((e) => {
        this.store.update(item.setError(this.uploader.getError(ErrorActions.addUploadErr)));
        this.stat.decrementLimits(item);
        return throwError(e);
      }),
      concatMap(() => this.api.getFileInfo(options)),
      tap((uploaded) => {
        const newUploaded = uploaded as UploadedFile;
        if (item.item?.isFromSuggests) {
          newUploaded.isFromSuggests = true;
        }
        item
          .setItem(newUploaded)
          .setStatus(FileItemStatus.uploaded)
          .setDescription(this.uploader.data?.labelHint);
        this.store.update(item);
      }),
      mapTo(undefined),
      takeUntil(
        cancel.pipe(
          filter((status) => status),
          tap(() => this.store.changeStatus(item, oldStatus)),
          tap(() => this.store.remove(item)),
          tap(() => this.stat.decrementLimitByFileItem(item)),
        ),
      ),
    );
  }

  delete(file: FileItem): void {
    this.createOperation(OperationType.delete, file, this.deleteOperation.bind(this));
  }

  deleteOperation({ item, cancel }: Operation, oldStatus: FileItemStatus): Observable<void> {
    const { status } = item;

    return of(item).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.delition)),
      concatMap((file) =>
        status === FileItemStatus.uploaded ||
        (status === FileItemStatus.error && file.error?.type === ErrorActions.serverError)
          ? this.api.deleteFile(file.createUploadedParams()).pipe(
              tap(() => this.stat.decrementLimitByFileItem(file)),
              mapTo(undefined),
            )
          : of(undefined),
      ),
      catchError((e) => {
        this.store.update(item.setError(this.uploader.getError(ErrorActions.addDeletionErr)));
        return throwError(e);
      }),
      tap(() => this.store.remove(item)),
      mapTo(null),
      takeUntil(
        cancel.pipe(
          filter((status) => status),
          tap(() => this.store.changeStatus(item, oldStatus)),
        ),
      ),
    );
  }

  copy(file: FileItem): void {
    this.createOperation(OperationType.prepare, file, this.copyOperation.bind(this));
  }

  copyOperation({ item, cancel }: Operation, oldStatus: FileItemStatus): Observable<void> {
    const options = item.createUploadOptions(
      this.uploader.objectId,
      UPLOAD_OBJECT_TYPE,
      this.uploader.getMnemonic(),
    );

    return of(item).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.uploading)),
      tap((file: FileItem) => this.stat.incrementLimits(file)),
      map((file: FileItem) =>
        this.store.files.getValue().find((storeFile) => storeFile.item.fileName === file.item.fileName)),
      concatMap((storedFile) => this.api.copyFile(options, storedFile)),
      catchError((e) => {
        this.store.update(item.setError(this.uploader.getError(ErrorActions.addUploadErr)));
        this.stat.decrementLimits(item);
        return throwError(e);
      }),
      concatMap(() => this.api.getFileInfo(options)),
      tap((uploaded) => {
        const newUploaded = uploaded as UploadedFile;
        if (item.item?.isFromSuggests) {
          newUploaded.isFromSuggests = true;
        }
        item
          .setItem(newUploaded)
          .setStatus(FileItemStatus.uploaded)
          .setDescription(this.uploader.data?.labelHint);
        this.store.update(item);
      }),
      mapTo(undefined),
      takeUntil(
        cancel.pipe(
          filter((status) => status),
          tap(() => this.store.changeStatus(item, oldStatus)),
          tap(() => this.store.remove(item)),
          tap(() => this.stat.decrementLimitByFileItem(item)),
        ),
      ),
    );
  }

  prepare(file: FileItem): void {
    this.createOperation(OperationType.prepare, file, this.prepareOperation.bind(this));
  }

  prepareOperation({ item, cancel }: Operation, oldStatus: FileItemStatus): Observable<void> {
    return of(item).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.preparation)),
      concatMap((file: FileItem) => this.validation.prepare(file)),
      tap((file: FileItem) => this.store.update(file)),
      tap((file: FileItem) => (file.status !== FileItemStatus.error ? this.upload(file) : null)),
      map(() => undefined),
      takeUntil(
        cancel.pipe(
          filter((status) => status),
          tap(() => this.store.changeStatus(item, oldStatus)),
          tap(() => this.store.remove(item)),
        ),
      ),
    );
  }

  download(file: FileItem): void {
    this.createOperation(OperationType.download, file, this.downloadOperation.bind(this));
  }

  downloadOperation({ item, cancel }: Operation, oldStatus: FileItemStatus): Observable<void> {
    const { status } = item;

    return of(item).pipe(
      tap((file) => this.store.changeStatus(file, FileItemStatus.downloading)),
      concatMap((file) => this.api.downloadFile(file.createUploadedParams())),
      tap((result) => {
        this.api.pushFileToBrowserForDownload(result, item.item);
      }),
      catchError((e) => {
        this.store.update(item.setError(this.uploader.getError(ErrorActions.addDownloadErr)));
        return throwError(e);
      }),
      tap(() => {
        this.store.changeStatus(item, status);
      }),
      map(() => undefined),
      takeUntil(
        cancel.pipe(
          filter((status) => status),
          tap(() => this.store.changeStatus(item, oldStatus)),
        ),
      ),
    );
  }

  cancel(type: OperationType, file: FileItem): void {
    this.operations[this.getOperationId(type, file)]?.cancel.next(true);
  }
}
