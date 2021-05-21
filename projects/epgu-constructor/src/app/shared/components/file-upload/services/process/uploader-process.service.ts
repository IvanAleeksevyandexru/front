import { Injectable } from '@angular/core';
import { OperationType } from '../../file-upload-item/data';

import { FileItem } from '../../models/FileItem.model';
import { of, Subject } from 'rxjs';
import { ProcessOperation } from '../../typings';
import { catchError, finalize, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { Uploader } from '../../models/Uploader.model';
import { UploadOperation } from '../../operations/upload.operation';
import { DownloadOperation } from '../../operations/download.operation';
import { PrepareOperation } from '../../operations/prepare.operation';
import { DeleteOperation } from '../../operations/delete.operation';

@Injectable()
export class UploaderProcessService {
  operations: Record<string, ProcessOperation> = {};

  stream = new Subject<ProcessOperation>();
  stream$ = this.stream.pipe(
    mergeMap((operation: ProcessOperation) => {
      const { status: fileStatus } = operation.file;

      if (this.operations[operation.id]) {
        return of(undefined);
      }
      this.operations[operation.id] = operation;
      return operation.run().pipe(
        takeUntil(
          operation.cancel$.pipe(
            tap(() => operation.uploader.store.changeStatus(operation.file, fileStatus)),
            tap(() => operation.onCancel()),
          ),
        ),
        catchError(() => of(undefined)),
        finalize(() => {
          delete this.operations[operation.id];
        }),
      );
    }),
  );

  getOperationId(type: OperationType, file: FileItem): string {
    return `${type}${file.id}`;
  }

  upload(uploader: Uploader, file: FileItem): void {
    this.stream.next(new UploadOperation(this, uploader, file));
  }

  delete(uploader: Uploader, file: FileItem): void {
    this.stream.next(new DeleteOperation(this, uploader, file));
  }

  prepare(uploader: Uploader, file: FileItem): void {
    this.stream.next(new PrepareOperation(this, uploader, file));
  }

  download(uploader: Uploader, file: FileItem): void {
    this.stream.next(new DownloadOperation(this, uploader, file));
  }

  cancel(type: OperationType, file: FileItem): void {
    this.operations[this.getOperationId(type, file)]?.cancel.next(true);
  }
}
