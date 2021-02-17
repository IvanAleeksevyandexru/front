import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { SuggestAction } from '../../data';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent implements AfterViewInit {
  @Input() isSuggests = false;
  @Input() files: FileItem[];
  @Input() suggests: FileItem[];
  @Input() set selectedId(id: string) {
    const index = this.files.findIndex((item) => item.id === id);
    this.selectedIndex = index === -1 ? null : index;
    this.selectedItem = this.selectedIndex !== null ? this.files[this.selectedIndex] : null;

    if (this.selectedItem && this.selectedItem?.isImage) {
      this.imageURL = window.URL.createObjectURL(this.selectedItem?.raw);
    }
  }

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();

  selectedItem?: FileItem;
  selectedIndex?: number = null;

  imageURL: string;

  ngAfterViewInit(): void {}
}
