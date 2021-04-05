import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SmuEventsService } from 'epgu-lib';
import {
  CancelAction,
  ErrorActions,
  FileItem,
  FileItemStatus,
  FileItemStatusText,
  OperationType,
} from '../../../file-upload/file-upload-item/data';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { iconsTypes, SuggestAction } from '../../data';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { createDownloadEvent } from '../../../../constants/redirect-event';

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
  @Output() view = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();

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
    this.extension = file.raw.name.split('.').pop().toLowerCase();
    this.size = file.raw.size;
    this.name = file.raw.name;
    this.type = file.raw.type;
    this.status = file.status;
    if (this.isImage) {
      this.imageUrl = file.urlToFile();
    }
    this.selectedIconType = iconsTypes[this.extension] ?? 'TXT';
  }
  selectedIconType: string;

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
  basePath = `${this.config.staticDomainAssetsPath}/assets/icons/svg/file-types/`;
  errorIcon = 'Error';

  iconsType = iconsTypes;

  constructor(
    private teraService: TerraByteApiService,
    public config: ConfigService,
    private smu: SmuEventsService,
    private deviceDetector: DeviceDetectorService,
  ) {}

  cancelAction(type: OperationType): void {
    this.cancel.emit({ type, item: this.fileItem });
  }
  viewAction(): void {
    if (!this.isError) {
      if (this.isImage) {
        this.preview();
      } else if (this.link) {
        if (this.deviceDetector.isWebView) {
          this.smu.notify(createDownloadEvent(this.link));
        } else {
          this.elementLink.nativeElement.click();
        }
      }
    }
  }

  detach(): void {
    this.suggest.emit({ isAdd: false, file: this.fileItem });
  }

  preview(): void {
    this.view.emit(this.fileItem);
  }
}
