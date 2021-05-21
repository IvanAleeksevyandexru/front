import { BehaviorSubject } from 'rxjs';
import {
  createError,
  ErrorActions,
  FileItem,
  FileItemError,
  FileItemStore,
  getAcceptTypes,
  OverLimits,
  updateLimits,
} from '../file-upload-item/data';
import {
  FileUploadItem,
  MaxCountByType,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { PrepareService } from '../prepare.service';
import { FileUploadService } from '../file-upload.service';

interface UploaderMessage {
  title: string;
  text: string;
  isError: boolean;
}

export class Uploader {
  loaded = new BehaviorSubject<boolean>(false);
  message = new BehaviorSubject<UploaderMessage | null>(null);
  store = new FileItemStore();
  overLimits = new BehaviorSubject<OverLimits>({
    totalSize: { count: 0, isMax: false },
    totalAmount: { count: 0, isMax: false },
    amount: { count: 0, isMax: false },
  });
  maxFileNumber = -1;

  maxTotalSize = this.limits.getMaxTotalFilesSize();
  maxTotalAmount = this.limits.getMaxTotalFilesAmount();
  maxAmount = this.limits.getUploader(this.config.uploadId).maxAmount || 0;
  readonly = this.config?.readonly === true;

  constructor(
    public prefixForMnemonic: string,
    public objectId: string,
    public config: FileUploadItem,
    public api: TerraByteApiService,
    public validation: PrepareService,
    public limits: FileUploadService,
  ) {}

  getError(action: ErrorActions): FileItemError {
    return createError(action, this.config, this.store, this.limits.getMaxTotalFilesSize());
  }
  /**
   * Возращает промежуточный путь для формирования мнемомники, конретно для этой формы
   */
  getSubMnemonicPath(): string {
    return [this.prefixForMnemonic, this.config.uploadId].join('.');
  }

  /**
   * Возвращает мнемонику для файла, формируя уникальный префикс
   */
  getMnemonic(): string {
    this.maxFileNumber += 1;
    return [this.getSubMnemonicPath(), this.maxFileNumber].join('.');
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
    const limits = { ...this.overLimits.getValue() };
    const checkSize = this.limits.checkSize(1, this.config.uploadId);

    const checkAmount = this.limits.checkAmount(1, this.config.uploadId);
    limits.totalSize.isMax = checkSize === -1;
    limits.amount.isMax = checkAmount === 1;
    limits.totalAmount.isMax = checkAmount === -1;
    this.overLimits.next(limits);
  }

  updateLimits(): void {
    if (!(this.config?.maxCountByTypes?.length > 0)) {
      return;
    }
    updateLimits(this.config, this.store, this.limits.getAmount(this.config.uploadId));
    this.limits.changeMaxAmount(
      (this.store.lastSelected as MaxCountByType)?.maxFileCount ?? 0,
      this.config.uploadId,
    );
    this.maxAmount = this.limits.getUploader(this.config.uploadId).maxAmount;
  }

  resetLimits(): void {
    const limits = { ...this.overLimits.getValue() };
    limits.totalAmount.count = 0;
    limits.totalSize.count = 0;
    limits.amount.count = 0;
    this.overLimits.next(limits);
  }

  decrementLimitByFileItem(file: FileItem): void {
    this.validation.checkAndSetMaxCountByTypes(this.config, file, this.store, false);
    this.decrementLimits(file);
    this.resetLimits();
  }

  get acceptTypes(): string {
    if (this.config?.maxCountByTypes && !this.store?.lastSelected) {
      return getAcceptTypes(
        this.config?.maxCountByTypes
          .reduce<string[]>((acc, countType) => acc.concat(countType.type), [])
          .filter((item, index, arr) => arr.indexOf(item) === index),
      );
    }
    return this.store?.lastSelected
      ? getAcceptTypes(this.store?.lastSelected.type)
      : getAcceptTypes(this.config.fileType);
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
}
