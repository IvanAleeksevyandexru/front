import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FileItem,
  FileItemStatus,
} from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

@Component({
  selector: 'epgu-constructor-uploader-manager-item',
  templateUrl: './uploader-manager-item.component.html',
  styleUrls: ['./uploader-manager-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderManagerItemComponent {
  @Output() update = new EventEmitter<FileItem>();
  @Output() cancel = new EventEmitter<FileItem>();
  @Output() delete = new EventEmitter<FileItem>();
  @Input() set file(file: FileItem) {
    this.fileItem = file;
    this.isErrors = file.errors.length !== 0;
    this.isImage = file.raw.type.indexOf('image') !== -1;
    this.ext = file.raw.name.split('.').pop();
    this.size = file.raw.size;
    this.name = file.raw.name;
    this.status = file.status;
  }

  status: FileItemStatus;
  size: number;
  name: string;
  ext: string;
  isErrors = false;
  isImage = false;
  fileItem: FileItem;

  preview(): void {}
}
