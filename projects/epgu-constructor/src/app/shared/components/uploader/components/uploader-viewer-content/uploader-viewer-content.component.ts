import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';

import { filter, map, tap } from 'rxjs/operators';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { FilesCollection, SuggestAction, ViewerInfo } from '../../data';
import { ViewerService } from '../../services/viewer/viewer.service';
import { ZoomComponent } from '../../../zoom/zoom.component';

@Component({
  selector: 'epgu-constructor-uploader-viewer-content',
  templateUrl: './uploader-viewer-content.component.html',
  styleUrls: ['./uploader-viewer-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerContentComponent implements AfterViewInit, OnInit {
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
  zoom: Observable<{ zoom: number; max: number }>;
  date: number;

  constructor(private viewerService: ViewerService) {}

  zoomMoveEnd(): void {
    this.moveZoom.next(true);
  }

  init({ file, size, position }): void {
    this.size = size;
    this.position = position;
    this.item = file;
    this.zoomComponent?.resetZoom();
    this.imageURL = file.isImage ? file.urlToFile() : null;
    this.date = new Date(file?.item?.udapted || file?.item?.created).getTime();
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
