import { Injectable } from '@angular/core';

import {
  FileUploadAttributes,
  FileUploadEmitValue,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';

/**
 * Сервис общей логики unique и custom скринов с FileUploadComponent
 */
@Injectable()
export class UploaderScreenService {
  private hideTotalAvailableSize: boolean;
  private hideTotalAvailableCount: boolean;
  private maxFileSize: number;
  private maxFileCount: number;
  private fileSizeLeft = 0;
  private fileCountLeft = 0;
  private currentFilesSize = 0;
  private currentFilesCount = 0;

  setValuesFromAttrs(attrs: FileUploadAttributes): void {
    if (attrs) {
      this.maxFileSize = attrs.maxSize;
      this.maxFileCount = attrs.maxFileCount;
      this.hideTotalAvailableSize =
        attrs.hideTotalAvailableSize == null ? true : attrs.hideTotalAvailableSize;
      this.hideTotalAvailableCount =
        attrs.hideTotalAvailableCount == null ? true : attrs.hideTotalAvailableCount;
    }
  }

  updateLimits(): void {
    if (this.maxFileSize) this.fileSizeLeft = this.maxFileSize - this.currentFilesSize;
    if (this.maxFileCount) this.fileCountLeft = this.maxFileCount - this.currentFilesCount;
  }

  showLimitsInfo(): boolean {
    return this.showSizeInfo() || this.showCountInfo();
  }

  showSizeInfo(): boolean {
    return !this.hideTotalAvailableSize && this.maxFileSize !== undefined;
  }

  showCountInfo(): boolean {
    return !this.hideTotalAvailableCount && this.maxFileCount !== undefined;
  }

  getCurrentFilesSize(): number {
    return this.currentFilesSize;
  }

  getCurrentFilesCount(): number {
    return this.currentFilesCount;
  }

  getFileSizeLeft(): number {
    return this.fileSizeLeft;
  }

  getFileCountLeft(): number {
    return this.fileCountLeft;
  }

  /**
   * Считаем объём и количество файлов уже загруженных на этом экране
   */
  calculateСurrentFiles(uploads: FileUploadEmitValue[]): void {
    let currentFilesSize = 0;
    let files: UploadedFile[] = [];

    uploads.forEach((upload: FileUploadEmitValue) => {
      if (upload.value && upload.value.length > 0) {
        files = [...files, ...upload.value];
      }
    });

    files.forEach((file: UploadedFile) => {
      currentFilesSize += file.fileSize;
    });

    this.updateCurrentFileSizeAndCount(currentFilesSize, files.length);
  }

  private updateCurrentFileSizeAndCount(size: number, length: number): void {
    this.currentFilesSize = size;
    this.currentFilesCount = length;
  }
}
