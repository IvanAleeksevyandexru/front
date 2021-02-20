import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';

import { filter, map, tap } from 'rxjs/operators';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { FilesCollection, SuggestAction, ViewerInfo } from '../../data';
// eslint-disable-next-line import/no-cycle
import { ViewerService } from '../../services/viewer/viewer.service';
import { ZoomComponent } from '../../../zoom/zoom.component';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent implements AfterViewInit, OnInit {
  @ViewChild('zoomComponent') zoomComponent!: ZoomComponent;
  @Input() type: FilesCollection;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();
  @Output() next = new EventEmitter<FilesCollection>();
  @Output() prev = new EventEmitter<FilesCollection>();

  selectedItem: Observable<ViewerInfo>;

  item: FileItem;
  imageURL: string;
  filesType = FilesCollection;
  isMoveZoom = false;
  size: number;
  position: number;
  zoom: Observable<{ zoom: number; max: number }>;
  constructor(public injector: Injector, private viewerService: ViewerService) {
    super(injector);
  }

  onClickComponent(event: MouseEvent): void {
    if (!this.isMoveZoom) {
      super.onClickComponent(event);
    }
    this.isMoveZoom = false;
  }

  zoomMoveEnd(): void {
    this.isMoveZoom = true;
  }

  init({ file, size, position }): void {
    this.size = size;
    this.position = position;
    this.item = file;
    this.zoomComponent?.resetZoom();
    this.imageURL = file.isImage ? file.urlToFile() : null;
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
    if (window.confirm('Удалить навсегда?')) {
      this.delete.emit(this.item);
    }
  }

  prevAction(): void {
    this.prev.emit(this.type);
  }

  suggestAction(isAdd: boolean): void {
    this.suggest.emit({ file: this.item, isAdd });
  }

  ngAfterViewInit(): void {
    this.zoom = this.zoomComponent?.zoom$$.pipe(
      map((zoom: number) => ({ zoom, max: this.zoomComponent.maxZoom })),
    );
  }

  ngOnInit(): void {
    this.selectedItem = this.viewerService.getSelectedFileByType(this.type).pipe(
      filter((info) => !!info),
      tap((info) => this.init(info)),
    );
  }
}
