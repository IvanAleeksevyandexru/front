import { ProcessOperation } from '../typings';
import { Observable } from 'rxjs/internal/Observable';
import { FileItem, FileItemStatus, OperationType } from '../file-upload-item/data';
import { of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

export class PrepareOperation extends ProcessOperation {
  type = OperationType.prepare;

  run(): Observable<void> {
    return of(this.file).pipe(
      tap((file: FileItem) => this.uploader.store.changeStatus(file, FileItemStatus.preparation)),
      concatMap((file: FileItem) =>
        this.uploader.validation.prepare(
          file,
          this.uploader.config,
          this.uploader.getError.bind(this),
          this.uploader.store,
        ),
      ),
      tap((file: FileItem) => this.uploader.store.update(file)),
      tap((file: FileItem) =>
        file.status !== FileItemStatus.error ? this.processing.upload(this.uploader, file) : null,
      ),
      map(() => undefined),
    );
  }

  onCancel(): void {
    this.uploader.store.remove(this.file);
  }
}
