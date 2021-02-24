import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { take, takeUntil, tap } from 'rxjs/operators';
import {
  CancelAction,
  ErrorActions,
  FileItem,
  FileItemStatus,
} from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { ViewerService } from '../../services/viewer/viewer.service';
import { FilesCollection, SuggestAction } from '../../data';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-uploader-manager',
  templateUrl: './uploader-manager.component.html',
  styleUrls: ['./uploader-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class UploaderManagerComponent {
  @Output() update = new EventEmitter<FileItem>();
  @Output() cancel = new EventEmitter<CancelAction>();
  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() repeat = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();

  @Input() set list(items: FileItem[]) {
    this.listItems = items;
    this.viewer.update(
      FilesCollection.suggest,
      items.filter(
        (item) =>
          (item.status === FileItemStatus.error &&
            item?.error?.type === ErrorActions.addDeletionErr) ||
          item.status === FileItemStatus.uploaded ||
          item.status === FileItemStatus.downloading ||
          item.status === FileItemStatus.delition,
      ),
    );
  }

  listItems: FileItem[];

  deleteViewer = this.viewer.delete
    .pipe(
      tap((file) => this.delete.emit(file)),
      takeUntil(this.unsubscribeService.ngUnsubscribe$),
    )
    .subscribe();

  downloadViewer = this.viewer.download
    .pipe(
      tap((file) => this.download.emit(file)),
      takeUntil(this.unsubscribeService.ngUnsubscribe$),
    )
    .subscribe();

  suggestViewer = this.viewer.suggest
    .pipe(
      tap((sudject) => this.suggest.emit(sudject)),
      takeUntil(this.unsubscribeService.ngUnsubscribe$),
    )
    .subscribe();

  constructor(private viewer: ViewerService, private unsubscribeService: UnsubscribeService) {}

  view(file: FileItem): void {
    this.viewer.open(FilesCollection.suggest, file.id).pipe(take(1)).subscribe();
  }
}
