import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { filter, tap } from 'rxjs/operators';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { FilesCollection, iconsTypes, SuggestAction, ViewerInfo } from '../../data';
import { ViewerService } from '../../services/viewer/viewer.service';
import { ZoomComponent } from '../../../zoom/zoom.component';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ZoomEvent } from '../../../zoom/typings';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-constructor-uploader-viewer-content',
  templateUrl: './uploader-viewer-content.component.html',
  styleUrls: ['./uploader-viewer-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerContentComponent implements OnInit {
  @ViewChild('zoomComponent') zoomComponent!: ZoomComponent;
  @Input() type: FilesCollection;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();
  @Output() next = new EventEmitter<FilesCollection>();
  @Output() prev = new EventEmitter<FilesCollection>();
  @Output() moveZoom = new EventEmitter<boolean>();

  selectedItem: Observable<ViewerInfo>;

  item: FileItem;
  imageURL: string;
  filesType = FilesCollection;
  size: number;
  position: number;
  zoom = new BehaviorSubject<ZoomEvent>({ zoom: 1, max: 1 });
  date: number;

  basePath = `${this.config.staticDomainAssetsPath}/assets/icons/svg/`;
  arrowIcon = `${this.basePath}arrow-circle.svg`;
  iconsType = iconsTypes;
  selectedIconType: string;
  isPDF = false;

  baseFileTypeIconPath = `${this.basePath}file-types/`;
  constructor(
    private viewerService: ViewerService,
    private config: ConfigService,
    private eventBusService: EventBusService,
  ) {}

  zoomMoveEnd(): void {
    this.moveZoom.next(true);
  }

  open($event: MouseEvent): void {
    if (!this.isPDF) {
      $event.preventDefault();
    }
  }
  init({ file, size, position }): void {
    this.size = size;
    this.position = position;
    this.item = file;
    this.zoomComponent?.resetZoom();
    this.imageURL = file.isImage ? file.urlToFile() : null;
    this.date = new Date(file?.item?.udapted || file?.item?.created).getTime();
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
    this.download.emit(this.item);
  }

  nextAction(): void {
    this.next.emit(this.type);
  }

  deleteAction(): void {
    // eslint-disable-no-alert
    if (window.confirm('Удалить навсегда?')) {
      this.delete.emit(this.item);
      this.eventBusService.emit('fileDeletedEvent', this.item);
    }
  }

  prevAction(): void {
    this.prev.emit(this.type);
  }

  suggestAction(isAdd: boolean): void {
    this.suggest.emit({ file: this.item, isAdd });
  }

  ngOnInit(): void {
    this.selectedItem = this.viewerService.getSelectedFileByType(this.type).pipe(
      filter((info) => !!info),
      tap((info) => this.init(info)),
    );
  }
}
