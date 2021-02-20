import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { FilesCollection, SuggestAction } from '../../data';

import { ZoomComponent } from '../../../zoom/zoom.component';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent {
  @ViewChild('zoomComponent') zoomComponent!: ZoomComponent;
  @Input() type: FilesCollection;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();
  @Output() next = new EventEmitter<FilesCollection>();
  @Output() prev = new EventEmitter<FilesCollection>();

  filesType = FilesCollection;
  isMoveZoom = false;

  onClickComponent(event: MouseEvent): void {
    if (!this.isMoveZoom) {
      super.onClickComponent(event);
    }
    this.isMoveZoom = false;
  }
}
