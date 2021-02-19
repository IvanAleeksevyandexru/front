import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { filter, tap } from 'rxjs/operators';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { FilesCollection, SuggestAction } from '../../data';
// eslint-disable-next-line import/no-cycle
import { ViewerService } from '../../services/viewer/viewer.service';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent {
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

  constructor(public injector: Injector, private viewerService: ViewerService) {
    super(injector);
  }

  init(file: FileItem): void {
    if (file.isImage && file?.raw) {
      this.imageURL = window.URL.createObjectURL(file?.raw);
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
