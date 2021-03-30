import { Injectable } from '@angular/core';
import {
  ErrorActions,
  FileItem,
  FileItemError,
  FileItemStatus,
  getSizeInMB,
} from './file-upload-item/data';
import { FileUploadItem } from '../../../core/services/terra-byte-api/terra-byte-api.types';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { CheckFailedReasons, FileUploadService } from './file-upload.service';
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
    acceptTypes?: string,
  ): Observable<FileItem> {
    return of(file).pipe(
      map((file: FileItem) => this.validateType(file, getError, acceptTypes)), // Проверка типа
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

  validateType(file: FileItem, getError: getErrorType, acceptTypes?: string): FileItem {
    return file.isTypeValid(acceptTypes)
      ? file
      : file.setError(getError(ErrorActions.addInvalidType));
  }

  validateAmount(file: FileItem, config: FileUploadItem, getError: getErrorType): FileItem {
    const { isValid, reason } = this.fileUploadService.checkFilesAmount(1, config.uploadId);
    if (!isValid) {
      switch (reason) {
        case CheckFailedReasons.total: {
          file.setError(getError(ErrorActions.addMaxTotalAmount));
          break;
        }
        case CheckFailedReasons.uploaderRestriction: {
          file.setError(getError(ErrorActions.addMaxAmount));
          break;
        }
        default:
          break;
      }
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
          map((raw: File) => {
            return file.setRaw(raw);
          }),
        )
      : of(file);
  }

  validateSize(file: FileItem, config: FileUploadItem, getError: getErrorType): FileItem {
    const { isValid, reason } = this.fileUploadService.checkFilesSize(
      file.raw.size,
      config.uploadId,
    );

    if (!isValid) {
      switch (reason) {
        case CheckFailedReasons.total: {
          file.setError(getError(ErrorActions.addMaxTotalSize));
          break;
        }
        case CheckFailedReasons.uploaderRestriction: {
          file.setError(getError(ErrorActions.addMaxSize));
          break;
        }
        default:
          break;
      }
    }
    return file;
  }
}
