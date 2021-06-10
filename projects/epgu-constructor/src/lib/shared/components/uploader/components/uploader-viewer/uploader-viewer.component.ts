import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from '@angular/core';
import { ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { FilesCollection, SuggestAction, ViewerInfo } from '../../data';
import { FileItem } from '../../../file-upload/data';

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
  @Input() readonly: boolean;

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
