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
import { SuggestAction } from '../../data';

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
  @Output() suggest = new EventEmitter<SuggestAction>();

  @Input() list: FileItem[];

  deleteViewer = this.viewer.delete.pipe(tap((file) => this.delete.emit(file)));
  downloadViewer = this.viewer.download.pipe(tap((file) => this.download.emit(file)));
  suggestViewer = this.viewer.suggest.pipe(tap((sudject) => this.suggest.emit(sudject)));

  subscriptions = new Subscription()
    .add(this.deleteViewer.subscribe())
    .add(this.downloadViewer.subscribe())
    .add(this.suggestViewer.subscribe());

  constructor(private viewer: ViewerService) {}

  view(file: FileItem): void {
    const sub = this.viewer.open(file.id, this.list, false).subscribe(() => {
      sub.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
