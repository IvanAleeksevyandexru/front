import { Injectable } from '@angular/core';
import { filter, shareReplay, tap } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
import {
  FileUploadItem,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { createError, ErrorActions, FileItem, FileItemError, getAcceptTypes } from '../../data';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderLimitsService } from '../limits/uploader-limits.service';

@Injectable()
export class UploaderManagerService {
  data$$ = new BehaviorSubject<FileUploadItem>(null);
  data$ = this.data$$.pipe(
    filter((data) => !!data),
    tap((data) => this.init(data)),
    shareReplay(1),
  );
  get data(): FileUploadItem {
    return this.data$$.getValue();
  }
  set data(data) {
    this.data$$.next(data);
  }

  readonly$$ = new BehaviorSubject<boolean>(false);
  get readonly(): boolean {
    return this.readonly$$.getValue();
  }
  set readonly(readonly: boolean) {
    this.readonly$$.next(readonly);
  }

  maxTotalSize$$ = new BehaviorSubject<number>(0);
  get maxTotalSize(): number {
    return this.maxTotalSize$$.getValue();
  }
  set maxTotalSize(maxTotalSize: number) {
    this.maxTotalSize$$.next(maxTotalSize);
  }

  maxTotalAmount$$ = new BehaviorSubject<number>(0);
  get maxTotalAmount(): number {
    return this.maxTotalAmount$$.getValue();
  }
  set maxTotalAmount(maxTotalAmount: number) {
    this.maxTotalAmount$$.next(maxTotalAmount);
  }

  maxAmount$$ = new BehaviorSubject<number>(0);
  get maxAmount(): number {
    return this.maxAmount$$.getValue();
  }
  set maxAmount(maxAmount: number) {
    this.maxAmount$$.next(maxAmount);
  }

  maxSize$$ = new BehaviorSubject<number>(0);
  get maxSize(): number {
    return this.maxAmount$$.getValue();
  }
  set maxSize(maxSize: number) {
    this.maxSize$$.next(maxSize);
  }

  prefixForMnemonic$$ = new BehaviorSubject<string>('');
  get prefixForMnemonic(): string {
    return this.prefixForMnemonic$$.getValue();
  }
  set prefixForMnemonic(prefixForMnemonic: string) {
    this.prefixForMnemonic$$.next(prefixForMnemonic);
  }

  objectId$$ = new BehaviorSubject<string>('');
  get objectId(): string {
    return this.objectId$$.getValue();
  }
  set objectId(objectId: string) {
    this.objectId$$.next(objectId);
  }

  maxFileNumber = -1;

  constructor(private store: UploaderStoreService, private limits: UploaderLimitsService) {}

  /**
   * Возращает промежуточный путь для формирования мнемомники, конретно для этой формы
   */
  getSubMnemonicPath(): string {
    return [this.prefixForMnemonic, this.data.uploadId].join('.');
  }

  /**
   * Возвращает мнемонику для файла, формируя уникальный префикс
   */
  getMnemonic(): string {
    this.maxFileNumber += 1;
    return [this.getSubMnemonicPath(), this.maxFileNumber].join('.');
  }

  getError(action: ErrorActions): FileItemError {
    return createError(
      action,
      this.data,
      this.store?.lastSelected ? this.store?.lastSelected.type : this.data.fileType,
      this.limits.getMaxTotalFilesSize(),
    );
  }

  init(data: FileUploadItem): void {
    this.maxTotalSize = this.limits.getMaxTotalFilesSize();
    this.maxTotalAmount = this.limits.getMaxTotalFilesAmount();
    this.maxAmount = this.limits.getUploader(data.uploadId).maxAmount;
    this.maxSize = this.limits.getUploader(data.uploadId).maxSize;
    this.readonly = data?.readonly === true;
  }

  get acceptTypes(): string {
    if (this.data?.maxCountByTypes && !this.store?.lastSelected) {
      return getAcceptTypes(
        this.data?.maxCountByTypes
          .reduce<string[]>((acc, countType) => acc.concat(countType.type), [])
          .filter((item, index, arr) => arr.indexOf(item) === index),
      );
    }
    const result = this.store?.lastSelected
      ? getAcceptTypes(this.store?.lastSelected.type)
      : getAcceptTypes(this.data.fileType);
    return result;
  }

  get hasImageTypes(): boolean {
    const types = this.acceptTypes;
    return (
      types.indexOf('.jpeg') !== -1 ||
      types.indexOf('.jpg') !== -1 ||
      types.indexOf('.gif') !== -1 ||
      types.indexOf('.png') !== -1 ||
      types.indexOf('.bmp') !== -1
    );
  }
  updateMaxFileNumber(file: UploadedFile): void {
    const index = Number(file.mnemonic.split('.').pop());
    this.maxFileNumber = index > this.maxFileNumber ? index : this.maxFileNumber;
  }

  updateLimits(amount: number, file?: FileItem, isAdd = true): void {
    if (!(this.data?.maxCountByTypes?.length > 0)) {
      return;
    }

    const types = this.store.getUniqueTypes(!isAdd && file ? file : null);
    if (isAdd && file && !types.includes(file.getType())) {
      types.push(file.getType());
    }

    const findedType = this.data?.maxCountByTypes.find(({ type }) =>
      types.every((fileType) => type.includes(fileType)),
    );

    if (findedType) {
      if (!this.store.lastSelected || findedType.maxFileCount >= amount) {
        this.store.lastSelected = findedType;
      }
    }
    if (types.length === 0) {
      this.store.lastSelected = this.data?.maxCountByTypes.reduce(
        (acc, v) => {
          acc.maxFileCount += v.maxFileCount;
          acc.type = acc.type
            .concat(v.type)
            .filter((item, index, arr) => arr.indexOf(item) === index);
          return acc;
        },
        {
          type: [],
          maxFileCount: 0,
        },
      );
    }
  }
}
