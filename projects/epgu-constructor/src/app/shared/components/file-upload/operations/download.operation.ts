import { ProcessOperation } from '../typings';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorActions, FileItemStatus, OperationType } from '../file-upload-item/data';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

export class DownloadOperation extends ProcessOperation {
  type = OperationType.download;

  run(): Observable<void> {
    const { store, api } = this.uploader;
    const { status } = this.file;

    return of(this.file).pipe(
      tap((file) => store.changeStatus(file, FileItemStatus.downloading)),
      concatMap((file) => api.downloadFile(file.createUploadedParams())),
      tap((result) => {
        api.pushFileToBrowserForDownload(result, this.file.item);
      }),
      catchError((e) => {
        this.uploader.store.update(
          this.file.setError(this.uploader.getError(ErrorActions.addDownloadErr)),
        );
        return throwError(e);
      }),
      tap(() => {
        store.changeStatus(this.file, status);
      }),
      map(() => undefined),
    );
  }
  // eslint-disable-next-line no-empty-function
  onCancel(): void {}
}
