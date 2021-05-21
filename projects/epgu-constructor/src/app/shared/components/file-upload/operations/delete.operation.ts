import { ProcessOperation } from '../typings';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorActions, FileItem, FileItemStatus, OperationType } from '../file-upload-item/data';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, tap } from 'rxjs/operators';

export class DeleteOperation extends ProcessOperation {
  type = OperationType.delete;

  run(): Observable<void> {
    const { status } = this.file;
    const { store, api } = this.uploader;

    return of(this.file).pipe(
      tap((file: FileItem) => store.changeStatus(file, FileItemStatus.delition)),
      concatMap((file) =>
        status === FileItemStatus.uploaded
          ? api.deleteFile(file.createUploadedParams()).pipe(
              tap(() => this.uploader.decrementLimitByFileItem(this.file)),
              mapTo(undefined),
            )
          : of(undefined),
      ),
      catchError((e) => {
        store.update(this.file.setError(this.uploader.getError(ErrorActions.addDeletionErr)));
        return throwError(e);
      }),
      tap(() => store.remove(this.file)),
      mapTo(null),
    );
  }
}
