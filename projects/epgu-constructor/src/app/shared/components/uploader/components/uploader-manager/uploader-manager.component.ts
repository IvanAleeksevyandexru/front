import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  CancelAction,
  FileItem,
} from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { ViewerService } from '../../services/viewer/viewer.service';
import { SudjectAction } from '../../data';

@Component({
  selector: 'epgu-constructor-uploader-manager',
  templateUrl: './uploader-manager.component.html',
  styleUrls: ['./uploader-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderManagerComponent implements OnDestroy {
  @Output() update = new EventEmitter<FileItem>();
  @Output() cancel = new EventEmitter<CancelAction>();
  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() repeat = new EventEmitter<FileItem>();
  @Output() sudject = new EventEmitter<SudjectAction>();

  @Input() list: FileItem[];

  deleteViewer = this.viewer.delete.pipe(tap((file) => this.delete.emit(file)));
  downloadViewer = this.viewer.download.pipe(tap((file) => this.download.emit(file)));
  sudjectViewer = this.viewer.sudjest.pipe(tap((sudject) => this.sudject.emit(sudject)));

  subscriptions = new Subscription()
    .add(this.deleteViewer.subscribe())
    .add(this.downloadViewer.subscribe())
    .add(this.sudjectViewer.subscribe());

  constructor(private viewer: ViewerService) {}

  view(index: number): void {
    this.viewer.open(index, this.list, false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
