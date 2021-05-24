import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface UploaderCounter {
  maxAmount: number;
  maxSize: number;
  amount: number;
  size: number;
}

type UploaderCounterStore = Record<string, UploaderCounter>;

enum UploaderCheckType {
  amount = 'amount',
  size = 'size',
}

type CheckResult = -1 | 0 | 1;

@Injectable()
export class FileUploadService {
  changes = new Subject<null>();

  private totalMaxAmount = new BehaviorSubject<number>(0);
  private totalMaxSize = new BehaviorSubject<number>(0);
  private currentAllAmount = new BehaviorSubject<number>(0);
  private currentAllSize = new BehaviorSubject<number>(0);
  private uploaders = new BehaviorSubject<UploaderCounterStore>({});

  setTotalMaxAmount(amount: number): void {
    this.totalMaxAmount.next(amount);
  }

  setTotalMaxSize(size: number): void {
    this.totalMaxSize.next(size);
  }

  registerUploader(name: string, maxAmount: number, maxSize: number): void {
    if (!name || maxSize < 0) {
      return;
    }
    this.resetUploader(name);
    const uploaders = this.getUploaders();

    uploaders[name] = this.createUploaderCounter(maxAmount, maxSize);
    this.uploaders.next(uploaders);
  }

  resetUploader(name: string): void {
    const uploader = this.getUploader(name);
    if (!uploader) return;

    this.currentAllSize.next(this.currentAllSize.getValue() - uploader.size);
    this.currentAllAmount.next(this.currentAllAmount.getValue() - uploader.amount);
    const uploaders = this.getUploaders();
    delete uploaders[name];
    this.uploaders.next(uploaders);
  }

  updateFilesAmount(value: number = 0, uploader: string): void {
    if (this.checkAmount(value, uploader) === 0) {
      this.updateAmount(value, uploader);
      this.changes.next(null);
    }
  }

  updateFilesSize(value: number = 0, uploader: string): void {
    if (this.checkSize(value, uploader) === 0) {
      this.updateSize(value, uploader);
      this.changes.next(null);
    }
  }

  changeMaxAmount(maxAmount: number, name: string): void {
    const uploader = this.getUploader(name);
    if (uploader?.maxAmount != maxAmount) {
      uploader.maxAmount = maxAmount;
      this.changeUploader(name, uploader);
      this.changes.next(null);
    }
  }

  getAmount(name: string): number {
    const uploader = this.getUploader(name);
    return uploader?.amount ?? 0;
  }

  getMaxTotalFilesAmount(): number {
    return this.totalMaxAmount.getValue();
  }

  getMaxTotalFilesSize(): number {
    return this.totalMaxSize.getValue();
  }

  checkAmount(value: number = 0, uploaderName: string): CheckResult {
    return this.check(value, uploaderName, UploaderCheckType.amount);
  }

  checkSize(value: number = 0, uploaderName: string): CheckResult {
    return this.check(value, uploaderName, UploaderCheckType.size);
  }

  getUploader(name: string): UploaderCounter {
    const uploaders = this.getUploaders();
    return uploaders[name];
  }

  private changeUploader(name: string, uploader: Partial<UploaderCounter>): void {
    const uploaders = this.getUploaders();
    if (uploaders[name]) {
      uploaders[name] = { ...uploaders[name], ...uploader };
      this.uploaders.next(uploaders);
    }
  }

  private updateAmount(value: number, name: string): void {
    const uploader = this.getUploader(name);
    uploader.amount += value;
    this.currentAllAmount.next(this.currentAllAmount.getValue() + value);
    this.changeUploader(name, uploader);
  }

  private updateSize(value: number, name: string): void {
    const uploader = this.getUploader(name);
    uploader.size += value;
    this.currentAllSize.next(this.currentAllSize.getValue() + value);
    this.changeUploader(name, uploader);
  }

  private createUploaderCounter(maxAmount: number, maxSize: number): UploaderCounter {
    return { maxAmount, maxSize, amount: 0, size: 0 };
  }

  private getUploaders(): UploaderCounterStore {
    return this.uploaders.getValue();
  }

  // 0 - лимиты не превышены | -1 превышен максимум для всех | 1  - превышен максимум для указанного uploader
  private check(value: number, uploaderName: string, type: UploaderCheckType): CheckResult {
    const maxTotal =
      type === UploaderCheckType.amount
        ? this.getMaxTotalFilesAmount()
        : this.getMaxTotalFilesSize();

    if (maxTotal > 0) {
      const current =
        type === UploaderCheckType.amount
          ? this.currentAllAmount.getValue()
          : this.currentAllSize.getValue();

      const total = current + value;
      if (total < 0 || total > maxTotal) {
        return -1;
      }
    }
    const uploader = this.getUploaders()[uploaderName];
    if (uploader) {
      const count = uploader[type] + value;
      const maxKey = type === UploaderCheckType.amount ? 'maxAmount' : 'maxSize';
      if (count < 0 || count > uploader[maxKey]) {
        return 1;
      }
    }

    return 0;
  }
}
