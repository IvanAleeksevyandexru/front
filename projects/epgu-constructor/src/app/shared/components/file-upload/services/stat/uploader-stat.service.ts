import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ErrorActions, FileItem, OverLimits } from '../../data';
import { UploaderMessage } from '../../typings';
import {
  FileUploadItem,
  MaxCountByType,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { UploaderLimitsService } from '../limits/uploader-limits.service';
import { UploaderManagerService } from '../manager/uploader-manager.service';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderValidationService } from '../validation/uploader-validation.service';

@Injectable()
export class UploaderStatService {
  stats = new BehaviorSubject<OverLimits>({
    totalSize: { count: 0, isMax: false },
    totalAmount: { count: 0, isMax: false },
    amount: { count: 0, isMax: false },
  });
  message = new BehaviorSubject<UploaderMessage | null>(null);
  get config(): FileUploadItem {
    return this.uploader.data;
  }

  constructor(
    private limits: UploaderLimitsService,
    private uploader: UploaderManagerService,
    private store: UploaderStoreService,
    private validation: UploaderValidationService,
  ) {}
  reset(): void {
    this.stats.next({
      totalSize: { count: 0, isMax: false },
      totalAmount: { count: 0, isMax: false },
      amount: { count: 0, isMax: false },
    });
    this.message.next(null);
  }

  amountFilter(file: FileItem): boolean {
    const maxTotalSize = file?.error?.type === ErrorActions.addMaxTotalSize;
    const maxTotalAmount = file?.error?.type === ErrorActions.addMaxTotalAmount;
    const maxAmount = file?.error?.type === ErrorActions.addMaxAmount;
    const limits = { ...this.stats.getValue() };
    limits.totalAmount.count = maxTotalAmount
      ? limits.totalAmount.count + 1
      : limits.totalAmount.count;
    limits.amount.count = maxAmount ? limits.amount.count + 1 : limits.amount.count;
    limits.totalSize.count = maxTotalSize ? limits.totalSize.count + 1 : limits.totalSize.count;
    this.stats.next(limits);
    return !maxAmount && !maxTotalAmount && !maxTotalSize;
  }

  incrementLimits(file: FileItem): void {
    if (file.limited) {
      return;
    }
    this.limits.updateFilesAmount(1, this.config.uploadId);
    this.limits.updateFilesSize(file.raw.size, this.config.uploadId);
    this.maxLimitUpdate();
    this.store.update(file.setLimited(true));
  }

  decrementLimits(file: FileItem): void {
    if (!file.limited) {
      return;
    }
    this.limits.updateFilesAmount(-1, this.config.uploadId);
    this.limits.updateFilesSize(-file.raw.size, this.config.uploadId);
    this.maxLimitUpdate();
    this.store.update(file.setLimited(false));
  }

  maxLimitUpdate(): void {
    const limits = { ...this.stats.getValue() };
    const checkSize = this.limits.checkSize(1, this.config.uploadId);

    const checkAmount = this.limits.checkAmount(1, this.config.uploadId);
    limits.totalSize.isMax = checkSize === -1;
    limits.amount.isMax = checkAmount === 1;
    limits.totalAmount.isMax = checkAmount === -1;
    this.stats.next(limits);
  }

  updateLimits(): void {
    if (!(this.config?.maxCountByTypes?.length > 0)) {
      return;
    }
    this.uploader.updateLimits(this.limits.getAmount(this.config.uploadId));
    this.limits.changeMaxAmount(
      (this.store.lastSelected as MaxCountByType)?.maxFileCount ?? 0,
      this.config.uploadId,
    );
    this.uploader.maxAmount = this.limits.getUploader(this.config.uploadId).maxAmount;
  }

  resetLimits(): void {
    const limits = { ...this.stats.getValue() };
    limits.totalAmount.count = 0;
    limits.totalSize.count = 0;
    limits.amount.count = 0;
    this.stats.next(limits);
  }

  decrementLimitByFileItem(file: FileItem): void {
    this.validation.checkAndSetMaxCountByTypes(file, false);
    this.decrementLimits(file);
    this.resetLimits();
  }
}
