import { ProcessOperation } from '../typings';
import { Observable } from 'rxjs/internal/Observable';
import {
  ErrorActions,
  FileItem,
  FileItemStatus,
  OperationType,
  UPLOAD_OBJECT_TYPE,
} from '../file-upload-item/data';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, tap } from 'rxjs/operators';
import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

export class UploadOperation extends ProcessOperation {
  type = OperationType.upload;

  run(): Observable<void> {
    const { file } = this;
    const options = file.createUploadOptions(
      this.uploader.objectId,
      UPLOAD_OBJECT_TYPE,
      this.uploader.getMnemonic(),
    );

    return of(file).pipe(
      tap((file: FileItem) => this.uploader.store.changeStatus(file, FileItemStatus.uploading)),
      tap((file: FileItem) => this.uploader.incrementLimits(file)),
      concatMap((file) => this.uploader.api.uploadFile(options, file.raw)),
      catchError((e) => {
        this.uploader.store.update(
          file.setError(this.uploader.getError(ErrorActions.addUploadErr)),
        );
        this.uploader.decrementLimits(file);
        return throwError(e);
      }),
      concatMap(() => this.uploader.api.getFileInfo(options)),
      tap((uploaded) => {
        const newUploaded = uploaded as UploadedFile;
        if (file.item?.isFromSuggests) {
          newUploaded.isFromSuggests = true;
        }
        file.setItem(newUploaded).setStatus(FileItemStatus.uploaded);
        this.uploader.store.update(file);
      }),
      mapTo(undefined),
    );
  }

  onCancel(): void {
    this.uploader.store.remove(this.file);
    //this.decrementLimitByFileItem(operation.item)
  }
}
