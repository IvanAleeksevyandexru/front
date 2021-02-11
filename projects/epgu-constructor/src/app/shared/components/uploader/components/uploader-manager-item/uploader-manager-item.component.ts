import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  CancelAction,
  ErrorActions,
  FileItem,
  FileItemStatus,
  FileItemStatusText,
  OperationType,
} from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { TerraByteApiService } from '../../../../../component/unique-screen/services/terra-byte-api/terra-byte-api.service';

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
  @Output() repeat = new EventEmitter<FileItem>();
  @ViewChild('elementLink', { read: ElementRef, static: true }) elementLink: ElementRef;
  @Input() set file(file: FileItem) {
    this.fileItem = file;

    this.isError = file.status === FileItemStatus.error;
    if (this.isError) {
      this.errorType = file.error.type;
    }

    if (file.raw.type.indexOf('pdf') !== -1 && file.item) {
      this.link = this.teraService.getDownloadApiPath(file.createUploadedParams());
    }
    this.isImage = file.isImage;
    this.extension = file.raw.name.split('.').pop();
    this.size = file.raw.size;
    this.name = file.raw.name;
    this.type = file.raw.type;
    this.status = file.status;
    if (this.isImage) {
      this.imageUrl = window.URL.createObjectURL(file.raw);
    }
  }

  errorTypeAction = ErrorActions;
  type: string;
  link: string;
  operationType = OperationType;
  fileStatus = FileItemStatus;
  imageUrl = '';
  status: FileItemStatus;
  size: number;
  name: string;
  extension: string;
  isError = false;
  errorType: ErrorActions;
  isImage = false;
  fileItem: FileItem;

  statusText = FileItemStatusText;

  constructor(private teraService: TerraByteApiService) {}

  cancelAction(type: OperationType): void {
    this.cancel.emit({ type, item: this.fileItem });
  }
  viewAction(): void {
    if (this.isImage) {
      this.preview();
    } else if (this.link) {
      this.elementLink.nativeElement.click();
    }
  }

  preview(): void {}
}
