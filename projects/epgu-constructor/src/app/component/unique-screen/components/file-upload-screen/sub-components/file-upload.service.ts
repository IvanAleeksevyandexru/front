import { Injectable } from '@angular/core';

@Injectable()
export class FileUploadService {
  private uploadedFilesSize = 0;
  private uploadedFilesAmount = 0;
  private maxFilesAmount = 0;
  private maxFilesSize = 0;

  get filesTotalSize(): number {
    return this.uploadedFilesSize;
  }

  get filesTotalAmount(): number {
    return this.uploadedFilesAmount;
  }

  setMaxFilesAmount(value: number): void {
    if (value > 0) {
      this.maxFilesAmount = value;
    }
  }

  setMaxFilesSize(value: number): void {
    if (value > 0) {
      this.maxFilesSize = value;
    }
  }

  updateFilesAmount(valueForUpdating: number = 0) {
    if (this.checkFilesAmount(valueForUpdating).isValid) {
      this.uploadedFilesAmount += valueForUpdating;
    }
  }

  checkFilesAmount(valueForUpdating: number = 0): { isValid: boolean } {
    const newFilesAmount = this.uploadedFilesAmount + valueForUpdating;
    const isValid = newFilesAmount >= 0 && newFilesAmount <= this.maxFilesAmount;
    return { isValid };
  }

  updateFilesSize(valueForUpdating: number = 0) {
    if (this.checkFilesSize(valueForUpdating).isValid) {
      this.uploadedFilesSize += valueForUpdating;
    }
  }

  checkFilesSize(valueForUpdating: number = 0): { isValid: boolean } {
    const newFilesSize = this.uploadedFilesSize + valueForUpdating;
    const isValid = newFilesSize >= 0 && newFilesSize <= this.maxFilesSize;
    return { isValid };
  }
}
