import { Injectable } from '@angular/core';

interface UploadersRestriction {
  [uploader: string]: number;
}

interface CheckValueOptions {
  totalMax: number;
  maxUploadersRes: UploadersRestriction;
  currentUploadersRes: UploadersRestriction;
}

export enum Uploaders {
  total = 'total',
}

export enum CheckFailedReasons {
  total = 'There is more value than total',
  uploaderRestriction = 'Uploader value is more/less than max/zero',
}

@Injectable()
export class FileUploadService {
  private totalMaxFilesAmount = 0;
  private totalMaxFilesSize = 0;
  private uploadedFilesSize: UploadersRestriction = {};
  private uploadedFilesAmount: UploadersRestriction = {};
  private maxFilesAmount: UploadersRestriction = {};
  private maxFilesSize: UploadersRestriction = {};

  getUploadedFilesAmount(): UploadersRestriction {
    return this.uploadedFilesAmount;
  }

  getUploadedFilesSize(): UploadersRestriction {
    return this.uploadedFilesSize;
  }

  getMaxFilesAmount(): UploadersRestriction {
    return this.maxFilesAmount;
  }

  getMaxFilesSize(): UploadersRestriction {
    return this.maxFilesSize;
  }



  getMaxTotalFilesAmount(): number {
    return this.totalMaxFilesAmount;
  }

  getMaxTotalFilesSize(): number {
    return this.totalMaxFilesSize;
  }

  setMaxFilesAmount(value: number, uploader: string): void {
    if (value < 0 && !uploader) {
      return;
    }

    if (uploader === Uploaders.total) {
      this.totalMaxFilesAmount = value;
    } else {
      this.maxFilesAmount[uploader] = value;
      this.uploadedFilesAmount[uploader] = 0;
    }
  }

  setMaxFilesSize(value: number, uploader: string): void {
    if (value < 0 && !uploader) {
      return;
    }

    if (uploader === Uploaders.total) {
      this.totalMaxFilesSize = value;
    } else {
      this.maxFilesSize[uploader] = value;
      this.uploadedFilesSize[uploader] = 0;
    }
  }

  updateFilesAmount(valueForUpdating: number = 0, uploader: string): void {
    if (this.checkFilesAmount(valueForUpdating, uploader).isValid) {
      this.uploadedFilesAmount[uploader] += valueForUpdating;
    }
  }

  checkFilesAmount(
    valueForUpdating: number = 0,
    uploader: string,
  ): { isValid: boolean; reason?: CheckFailedReasons } {
    const options = {
      totalMax: this.totalMaxFilesAmount,
      maxUploadersRes: this.maxFilesAmount,
      currentUploadersRes: this.uploadedFilesAmount,
    };
    return this.checkFiles(valueForUpdating, uploader, options);
  }

  updateFilesSize(valueForUpdating: number = 0, uploader: string): void {
    if (this.checkFilesSize(valueForUpdating, uploader).isValid) {
      this.uploadedFilesSize[uploader] += valueForUpdating;
    }
  }
  decrementFilesSize(valueForUpdating: number = 0, uploader: string): void {
    if (this.checkFilesSize(valueForUpdating, uploader).isValid) {
      this.uploadedFilesSize[uploader] -= valueForUpdating;
    }
  }

  checkFilesSize(
    valueForUpdating: number = 0,
    uploader: string,
  ): { isValid: boolean; reason?: CheckFailedReasons } {
    const options = {
      totalMax: this.totalMaxFilesSize,
      maxUploadersRes: this.maxFilesSize,
      currentUploadersRes: this.uploadedFilesSize,
    };
    return this.checkFiles(valueForUpdating, uploader, options);
  }

  private checkFiles(
    valueForUpdating: number = 0,
    uploader: string,
    options: CheckValueOptions,
  ): { isValid: boolean; reason?: CheckFailedReasons } {
    const { totalMax, maxUploadersRes, currentUploadersRes } = options;

    if (totalMax) {
      const currentTotal = Object.values(currentUploadersRes).reduce(
        (total, current) => total + current,
        0,
      );
      const newTotal = currentTotal + valueForUpdating;

      const invalidTotal = newTotal < 0 || newTotal > totalMax;

      if (invalidTotal) {
        return { isValid: false, reason: CheckFailedReasons.total };
      }
    }

    if (maxUploadersRes[uploader]) {
      const newUploaderResValue = currentUploadersRes[uploader] + valueForUpdating;
      const invalidUploaderResValue =
        newUploaderResValue < 0 || newUploaderResValue > maxUploadersRes[uploader];

      if (invalidUploaderResValue) {
        return { isValid: false, reason: CheckFailedReasons.uploaderRestriction };
      }
    }

    return { isValid: true };
  }
}
