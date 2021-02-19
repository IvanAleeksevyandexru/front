import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';

import { filter, tap } from 'rxjs/operators';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { FilesCollection, SuggestAction } from '../../data';
// eslint-disable-next-line import/no-cycle
import { ViewerService } from '../../services/viewer/viewer.service';
import { ZoomComponent } from '../../../zoom/zoom.component';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent {
  @ViewChild('zoom', { static: true }) zoom: ZoomComponent;
  @Input() type: FilesCollection;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();
  @Output() next = new EventEmitter<FilesCollection>();
  @Output() prev = new EventEmitter<FilesCollection>();

  selectedItem: Observable<FileItem> = this.viewerService.getSelectedFileByType().pipe(
    tap(() => console.log('changed')),
    filter((file) => !!file),
    tap((file) => this.init(file)),
  );
  item: FileItem;
  imageURL: string;
  filesType = FilesCollection;
  isMoveZoom = false;

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

  init(file: FileItem): void {
    if (file.isImage) {
      this.imageURL = file.urlToFile();
    } else {
      this.imageURL = null;
    }
  }

  nextAction(): void {
    this.next.emit(this.type);
  }

  prevAction(): void {
    this.prev.emit(this.type);
  }
}
