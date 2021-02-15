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
import { SudjectAction } from '../../data';

@Component({
  selector: 'epgu-constructor-uploader-viewer',
  templateUrl: './uploader-viewer.component.html',
  styleUrls: ['./uploader-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderViewerComponent extends ModalBaseComponent implements AfterViewInit {
  @Input() isSudjects = false;
  @Input() files: FileItem[];
  @Input() sudjects: FileItem[];
  @Input() index?: number;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() sudjest = new EventEmitter<SudjectAction>();

  ngAfterViewInit(): void {}
}
