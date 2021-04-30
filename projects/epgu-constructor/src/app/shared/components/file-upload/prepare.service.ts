import { Injectable } from '@angular/core';
import {
  ErrorActions,
  FileItem,
  FileItemError,
  FileItemStatus,
  FileItemStore,
  getAcceptTypes,
  getSizeInMB,
  updateLimits,
} from './file-upload-item/data';
import {
  FileUploadItem,
  MaxCountByType,
} from '../../../core/services/terra-byte-api/terra-byte-api.types';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { FileUploadService } from './file-upload.service';
import {
  CompressionOptions,
  CompressionService,
} from '../upload-and-edit-photo-form/service/compression/compression.service';

type getErrorType = (action: ErrorActions) => FileItemError;

@Injectable()
export class PrepareService {
  maxImgSizeInBytes = 525288;

  constructor(
    private compressionService: CompressionService,
    private fileUploadService: FileUploadService,
  ) {}

  prepare(
    file: FileItem,
    config: FileUploadItem,
    getError: getErrorType,
    store: FileItemStore,
  ): Observable<FileItem> {
    return of(file).pipe(
      tap((file: FileItem) => this.checkAndSetMaxCountByTypes(config, file, store)),
      map((file: FileItem) => this.validateType(config, file, getError, store)), // Проверка типа
      map((file: FileItem) =>
        file.status !== FileItemStatus.error ? this.validateAmount(file, config, getError) : file,
      ), // Проверка кол-ва
      concatMap((file: FileItem) =>
        file.status !== FileItemStatus.error ? this.compressImage(file, getError) : of(file),
      ), // Компрессия
      map((file: FileItem) =>
        file.status !== FileItemStatus.error ? this.validateSize(file, config, getError) : file,
      ), // Проверка размера
    );
  }

  checkAndSetMaxCountByTypes(
    config: FileUploadItem,
    file: FileItem,
    store: FileItemStore,
    isAdd = true,
  ): void {
    if (!(config?.maxCountByTypes?.length > 0)) {
      return;
    }
    updateLimits(config, store, this.fileUploadService.getAmount(config.uploadId), file, isAdd);
    this.fileUploadService.changeMaxAmount(
      (store.lastSelected as MaxCountByType)?.maxFileCount ?? 0,
      config.uploadId,
    );
  }

  validateType(
    config: FileUploadItem,
    file: FileItem,
    getError: getErrorType,
    store: FileItemStore,
  ): FileItem {
    return file.isTypeValid(
      store?.lastSelected
        ? getAcceptTypes(store?.lastSelected.type)
        : getAcceptTypes(config.fileType),
    )
      ? file
      : file.setError(getError(ErrorActions.addInvalidType));
  }

  validateAmount(file: FileItem, config: FileUploadItem, getError: getErrorType): FileItem {
    const check = this.fileUploadService.checkAmount(1, config.uploadId);
    if (check !== 0) {
      file.setError(
        getError(check === -1 ? ErrorActions.addMaxTotalAmount : ErrorActions.addMaxAmount),
      );
    }
    return file;
  }

  compressImage(file: FileItem, getError: getErrorType): Observable<FileItem> {
    const compressedImageOptions: CompressionOptions = {
      maxSizeMB: getSizeInMB(this.maxImgSizeInBytes),
      deepChecking: true,
      maxWidthOrHeight: 1024,
    };
    return this.compressionService.isValidImageType(file.raw)
      ? from(this.compressionService.imageCompression(file.raw, compressedImageOptions)).pipe(
          catchError(() => {
            return of(file.setError(getError(ErrorActions.addInvalidFile)));
          }),
          map((raw: Blob | FileItem) => (raw instanceof Blob ? file.setRaw(raw as File) : file)),
        )
      : of(file);
  }

  validateSize(file: FileItem, config: FileUploadItem, getError: getErrorType): FileItem {
    const check = this.fileUploadService.checkSize(file.raw.size, config.uploadId);
    if (check !== 0) {
      file.setError(
        check === -1 ? getError(ErrorActions.addMaxTotalSize) : getError(ErrorActions.addMaxSize),
      );
    }
    return file;
  }
}
