import { v4 } from 'uuid';
import {
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileItemError, FileItemStatus } from '../file-upload-item/data';

export class FileItem {
  id = v4();
  error: FileItemError;
  isImage: boolean;
  limited = false;
  isRawMock = false;
  attached = false;
  constructor(
    public status: FileItemStatus,
    public fileUploadApiUrl: string,
    public raw?: File,
    public item?: UploadedFile,
  ) {
    if (item) {
      this.item.uploaded = true;
    }
    if (!raw && item) {
      this.raw = {
        size: item.fileSize,
        name: item.fileName,
        type: item.mimeType || '',
      } as File;
      this.isRawMock = true;
    }
    this.isImage = /^.*\.(jpe?g|gif|png|bmp)$/i.test(this.raw.name);
  }

  setAttached(attached: boolean): FileItem {
    this.attached = attached;
    return this;
  }

  urlToFile(): string {
    if (!this.isRawMock) {
      return window.URL.createObjectURL(this.raw);
    }

    return this.item
      ? `${this.fileUploadApiUrl}/${this.item?.objectId}/${this.item?.objectTypeId}/download?mnemonic=${this.item?.mnemonic}`
      : '';
  }

  setLimited(limit: boolean): FileItem {
    this.limited = limit;
    return this;
  }

  setError(error: FileItemError): FileItem {
    this.error = error;
    this.setStatus(FileItemStatus.error);
    return this;
  }
  clearError(): FileItem {
    this.error = null;
    return this;
  }
  setStatus(status: FileItemStatus): FileItem {
    this.status = status;
    return this;
  }
  setRaw(raw: File): FileItem {
    this.raw = raw;
    this.isRawMock = false;
    return this;
  }
  setItem(item: UploadedFile): FileItem {
    this.item = item;
    this.item.uploaded = true;
    return this;
  }

  createUploadedParams(): TerraFileOptions {
    return {
      objectId: this.item.objectId,
      objectType: this.item.objectTypeId,
      mnemonic: this.item.mnemonic,
      mimeType: this.item.mimeType,
    } as TerraFileOptions;
  }

  createUploadOptions(
    objectId: string,
    objectType: number,
    mnemonic: string,
  ): TerraUploadFileOptions {
    return {
      name: this.raw.name,
      mimeType: this.raw.type,
      objectId: objectId,
      objectType: objectType,
      mnemonic: mnemonic,
    } as TerraUploadFileOptions;
  }

  getType(): string {
    return this.raw.name.split('.').pop().toUpperCase();
  }

  isTypeValid(acceptTypes?: string): boolean {
    if (!acceptTypes) {
      return true;
    }
    const extension = `.${this.raw.name.split('.').pop()}`.toLowerCase();
    const validTypes = acceptTypes.toLowerCase().split(',');

    return validTypes.some((validType) => validType === extension);
  }
}
