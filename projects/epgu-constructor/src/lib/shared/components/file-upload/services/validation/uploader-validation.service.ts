import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import {
  CompressionOptions,
  CompressionService,
} from '../../../upload-and-edit-photo-form/service/compression/compression.service';

import { ErrorActions, FileItem, FileItemStatus, getAcceptTypes, getSizeInMB } from '../../data';
import { MaxCountByType } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderLimitsService } from '../limits/uploader-limits.service';
import { UploaderManagerService } from '../manager/uploader-manager.service';
import { ScreenService } from '../../../../../screen/screen.service';

@Injectable()
export class UploaderValidationService {
  maxImgSizeInBytes = 525288;

  constructor(
    private compressionService: CompressionService,
    private limits: UploaderLimitsService,
    private uploader: UploaderManagerService,
    private store: UploaderStoreService,
    private screenService: ScreenService,
  ) {}

  prepare(file: FileItem): Observable<FileItem> {
    return of(file).pipe(
      tap((fileItem: FileItem) => this.checkAndSetMaxCountByTypes(fileItem)),
      map((fileItem: FileItem) =>
        fileItem.status !== FileItemStatus.error ? this.checkServerError(fileItem) : fileItem,
      ), // Проверка ошибок сервера
      map((fileItem: FileItem) => this.validateFileName(fileItem)),
      map((fileItem: FileItem) => this.validateType(fileItem)), // Проверка типа
      map((fileItem: FileItem) =>
        fileItem.status !== FileItemStatus.error ? this.validateAmount(fileItem) : fileItem,
      ), // Проверка кол-ва
      concatMap((fileItem: FileItem) =>
        fileItem.status !== FileItemStatus.error ? this.compressImage(fileItem) : of(fileItem),
      ), // Компрессия
      map((fileItem: FileItem) => this.validateMinSize(fileItem)), // Проверка min размера файла
      map((fileItem: FileItem) =>
        fileItem.status !== FileItemStatus.error ? this.validateSize(fileItem) : fileItem,
      ), // Проверка размера
    );
  }

  checkServerError(file: FileItem): FileItem {
    const error = this.screenService.componentErrors[file.item?.mnemonic];
    if (error) {
      file.setError({
        type: ErrorActions.serverError,
        text: 'Ошибка при загрузке',
        description: error,
      });
    }
    return file;
  }

  checkAndSetMaxCountByTypes(file: FileItem, isAdd = true): void {
    const { data } = this.uploader;

    if (!(data?.maxCountByTypes?.length > 0)) {
      return;
    }
    this.uploader.updateLimits(this.limits.getAmount(data.uploadId), file, isAdd);
    const amount = (this.store.lastSelected as MaxCountByType)?.maxFileCount ?? 0;
    this.limits.changeMaxAmount(amount, data.uploadId);
    this.uploader.maxAmount = amount;
  }

  validateType(file: FileItem): FileItem {
    return file.isTypeValid(
      this.store?.lastSelected
        ? getAcceptTypes(this.store?.lastSelected.type)
        : getAcceptTypes(this.uploader.data.fileType),
    )
      ? file
      : file.setError(this.uploader.getError(ErrorActions.addInvalidType));
  }

  validateAmount(file: FileItem): FileItem {
    const check = this.limits.checkAmount(1, this.uploader.data.uploadId);
    if (check !== 0) {
      file.setError(
        this.uploader.getError(
          check === -1 ? ErrorActions.addMaxTotalAmount : ErrorActions.addMaxAmount,
        ),
      );
    }
    return file;
  }

  validateFileName(file: FileItem): FileItem {
    if (!this.uploader.data?.validation || this.uploader.data.validation?.length === 0) {
      return file;
    }

    const index = this.uploader.data.validation.findIndex(
      (validation) => !new RegExp(validation.value).test(file.raw.name),
    );
    if (index !== -1) {
      file.setError({
        type: ErrorActions.addInvalidFileName,
        text: this.uploader.data.validation[index]?.errorMsg,
      });
    }

    return file;
  }

  compressImage(file: FileItem): Observable<FileItem> {
    const notCompression = this.uploader.data?.notCompression || false;

    if (notCompression) {
      return of(file);
    }

    const compressedImageOptions: CompressionOptions = {
      maxSizeMB: getSizeInMB(this.maxImgSizeInBytes),
      deepChecking: true,
      maxWidthOrHeight: 1024,
    };
    return this.compressionService.isValidImageType(file.raw)
      ? from(this.compressionService.imageCompression(file.raw, compressedImageOptions)).pipe(
          catchError(() => {
            return of(file.setError(this.uploader.getError(ErrorActions.addInvalidFile)));
          }),
          map((raw: Blob | FileItem) => (raw instanceof Blob ? file.setRaw(raw as File) : file)),
        )
      : of(file);
  }

  validateSize(file: FileItem): FileItem {
    const check = this.limits.checkSize(file.raw.size, this.uploader.data.uploadId);
    if (check !== 0) {
      file.setError(
        check === -1
          ? this.uploader.getError(ErrorActions.addMaxTotalSize)
          : this.uploader.getError(ErrorActions.addMaxSize),
      );
    }
    return file;
  }

  validateMinSize(file: FileItem): FileItem {
    const minSize = this.uploader.data?.minSize || 1;
    if (file.raw.size < minSize) {
      file.setError(this.uploader.getError(ErrorActions.addMinSize));
    }
    return file;
  }
}
