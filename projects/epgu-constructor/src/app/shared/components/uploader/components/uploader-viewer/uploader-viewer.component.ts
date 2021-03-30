import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FilesCollection, SuggestAction, ViewerInfo } from '../../data';
import { FileItem } from '../../../file-upload/file-upload-item/data';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent {
  @Input() type: FilesCollection;
  @Input() set item(item: ViewerInfo) {
    this.selectedItem = item;
    this.changeDetector.markForCheck();
  }

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();
  @Output() next = new EventEmitter<FilesCollection>();
  @Output() prev = new EventEmitter<FilesCollection>();

  selectedItem: ViewerInfo;
  filesType = FilesCollection;
  isMoveZoom = false;

  constructor(public injector: Injector, public changeDetector: ChangeDetectorRef) {
    super(injector);
  }

  onClickComponent(event: MouseEvent): void {
    if (!this.isMoveZoom) {
      super.onClickComponent(event);
    }
    this.isMoveZoom = false;
  }
}
