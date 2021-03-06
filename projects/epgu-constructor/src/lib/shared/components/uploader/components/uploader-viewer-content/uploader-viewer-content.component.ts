import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  DeviceDetectorService,
  ConfigService,
  createDownloadEvent,
  BaseComponent,
} from '@epgu/epgu-constructor-ui-kit';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { FilesCollection, iconsTypes, SuggestAction, ViewerInfo } from '../../data';
import { ZoomComponent } from '../../../zoom/zoom.component';
import { ZoomEvent } from '../../../zoom/typings';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { SuggestMonitorService } from '../../../../services/suggest-monitor/suggest-monitor.service';
import { FileItem, FileItemStatus } from '../../../file-upload/data';
import { SuggestActions } from '../../../../constants/suggest';
import { ScreenService } from '../../../../../screen/screen.service';
import { FileUploadAttributes } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-uploader-viewer-content',
  templateUrl: './uploader-viewer-content.component.html',
  styleUrls: ['./uploader-viewer-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerContentComponent extends BaseComponent {
  @ViewChild('zoomComponent') zoomComponent!: ZoomComponent;
  @Input() type: FilesCollection;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();
  @Output() next = new EventEmitter<FilesCollection>();
  @Output() prev = new EventEmitter<FilesCollection>();
  @Output() moveZoom = new EventEmitter<boolean>();
  @Input() readonly: boolean;
  @Input() set selectedItem(info: ViewerInfo) {
    this.init(info);
  }

  item: FileItem;
  imageURL: string;
  filesType = FilesCollection;
  size: number;
  position: number;
  description: string;
  zoom = new BehaviorSubject<ZoomEvent>({ zoom: 1, max: 1 });
  date: number;
  isConfirm = false;

  basePath = `${this.config.staticDomainAssetsPath}/assets/icons/svg/`;
  arrowIcon = `${this.basePath}arrow-circle.svg`;
  iconsType = iconsTypes;
  selectedIconType: string;
  isPDF = false;
  isError = false;
  baseFileTypeIconPath = `${this.basePath}file-types/`;

  constructor(
    private config: ConfigService,
    private smu: SmuEventsService,
    private deviceDetector: DeviceDetectorService,
    private teraService: TerraByteApiService,
    private monitor: SuggestMonitorService,
    private screenService: ScreenService,
  ) {
    super();
  }

  zoomMoveEnd(): void {
    this.moveZoom.next(true);
  }

  open($event: MouseEvent): void {
    if (!this.isPDF) {
      $event.preventDefault();
    }
  }

  init({ file, size, position }: ViewerInfo): void {
    this.isError = file.status === FileItemStatus.error;
    this.isConfirm = false;
    this.size = size;
    this.position = position;
    this.description = this.setModalDescription(file);
    this.item = file;
    this.zoomComponent?.resetZoom();
    this.imageURL = file.isImage ? file.urlToFile() : null;
    this.date = new Date(file?.item?.updated || file?.item?.created).getTime();
    const extension = file.raw.name.split('.').pop().toLowerCase();
    this.isPDF = extension === 'pdf';
    this.selectedIconType = this.iconsType[extension] ?? 'TXT';
  }

  zoomAction(zoom: ZoomEvent): void {
    this.zoom.next(zoom);
  }

  zoomIn(): void {
    this.zoomComponent?.zoomIn();
  }

  zoomOut(): void {
    this.zoomComponent?.resetZoom();
  }

  downloadAction(): void {
    if (this.deviceDetector.isWebView) {
      this.smu.notify(
        createDownloadEvent(this.teraService.getDownloadApiPath(this.item.createUploadedParams())),
      );
    } else {
      this.download.emit(this.item);
    }

    this.monitor.handleAutocompleteEvent(SuggestActions.DOWNLOAD_ACTION, 'UPLOAD_DOWNLOAD_BUTTON', {
      mnemonic: this.item.createUploadedParams().mnemonic,
      date: new Date().toISOString(),
    });
  }

  nextAction(): void {
    this.next.emit(this.type);
  }

  deleteAction(): void {
    this.delete.emit(this.item);
  }

  cancelAction(): void {
    this.isConfirm = false;
  }

  confirmAction(): void {
    if (this.item.attached) {
      this.suggestAction(false);
    } else {
      this.deleteAction();
    }
  }

  prevAction(): void {
    this.prev.emit(this.type);
  }

  suggestAction(isAdd: boolean): void {
    this.suggest.emit({ file: this.item, isAdd });
    this.monitor.handleAutocompleteEvent(SuggestActions.ADD_ACTION, 'UPLOAD_ADD_BUTTON', {
      mnemonic: this.item.createUploadedParams().mnemonic,
      date: new Date().toISOString(),
    });
  }

  private setModalDescription(file: FileItem): string {
    return (
      (this.screenService.component?.attrs as FileUploadAttributes)?.previewModalDescription ||
      file.item.description ||
      '??????????????????, ?????? ???????????????? ???? ??????????????????, ???????????????? ???????????? ??????????, ???????????? ???? ???????????????? ???????????????? ?? ???? ????????????????. ?????? ??????????, ?????????? ?????????????????? ??????????????'
    );
  }
}
