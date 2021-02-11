import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CancelAction,
  FileItem,
  FileItemStatus,
  FileItemStatusText,
  OperationType,
} from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

@Component({
  selector: 'epgu-constructor-uploader-manager-item',
  templateUrl: './uploader-manager-item.component.html',
  styleUrls: ['./uploader-manager-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderManagerItemComponent {
  @Output() update = new EventEmitter<FileItem>();
  @Output() cancel = new EventEmitter<CancelAction>();
  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Input() set file(file: FileItem) {
    this.fileItem = file;

    this.isError = file.status === FileItemStatus.error;
    if (this.isError) {
      this.errorType = file.error.type;
    }
    this.isImage = file.isImage;
    this.extension = file.raw.name.split('.').pop();
    this.size = file.raw.size;
    this.name = file.raw.name;
    this.status = file.status;
    if (this.isImage) {
      this.imageUrl = window.URL.createObjectURL(file.raw);
    }
  }

  operationType = OperationType;
  fileStatus = FileItemStatus;
  imageUrl = '';
  status: FileItemStatus;
  size: number;
  name: string;
  extension: string;
  isError = false;
  errorType: string;
  isImage = false;
  fileItem: FileItem;

  statusText = FileItemStatusText;

  cancelAction(type: OperationType): void {
    this.cancel.emit({ type, item: this.fileItem });
  }
  viewAction(): void {
    if (this.isImage) {
      this.preview();
    } else {
      this.download.emit(this.fileItem);
    }
  }

  preview(): void {}
}
