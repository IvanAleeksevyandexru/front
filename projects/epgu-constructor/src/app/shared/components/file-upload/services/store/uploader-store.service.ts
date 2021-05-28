import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MaxCountByType } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ErrorActions, FileItem, FileItemStatus } from '../../data';

@Injectable()
export class UploaderStoreService {
  files = new BehaviorSubject<FileItem[]>([]);
  lastSelected?: MaxCountByType;

  reset(): void {
    this.files.next([]);
    this.lastSelected = null;
  }

  getUniqueTypes(without?: FileItem): string[] {
    const files = this.getFiles();
    const useFiles = without ? files.filter((file) => file.id !== without.id) : files;
    return Array.from(new Set(useFiles.map((v) => v.getType())));
  }

  getFiles(): FileItem[] {
    return this.files.getValue();
  }

  add(file: FileItem): void {
    const files = [...this.getFiles(), file];
    this.files.next(files);
  }

  update(file: FileItem): void {
    const files = [...this.getFiles()];
    const index = files.findIndex((item) => item.id === file.id);
    files[index] = Object.assign(Object.create(Object.getPrototypeOf(file)), file);
    this.files.next(files);
  }

  remove(file: FileItem): void {
    const files = [...this.getFiles()];
    this.files.next(files.filter((item) => item.id !== file.id));
  }

  removeWithErrorStatus(ignoreTypes: ErrorActions[] = []): void {
    const files = [...this.getFiles()];
    this.files.next(
      files.filter(
        (item) =>
          (item.status === FileItemStatus.error && ignoreTypes.includes(item?.error?.type)) ||
          item.status !== FileItemStatus.error,
      ),
    );
  }

  changeStatus(file: FileItem, status: FileItemStatus): void {
    file.setStatus(status);
    this.update(file);
  }

  errorTo(errorType: ErrorActions, status: FileItemStatus): void {
    const files = [...this.getFiles()];
    files.forEach((item) =>
      item?.error?.type === errorType ? this.update(item.setStatus(status).clearError()) : null,
    );
  }
}
