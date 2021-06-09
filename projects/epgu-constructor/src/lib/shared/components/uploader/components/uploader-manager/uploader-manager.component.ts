import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CancelAction, ErrorActions, FileItem, FileItemStatus } from '../../../file-upload/data';
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
  @Input() readonly: boolean;

  @Input() set list(items: FileItem[]) {
    this.listItems = items;
    this.viewerItems.next(
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

  viewerItems = new BehaviorSubject<FileItem[]>([]);
  listItems: FileItem[];

  constructor(private viewer: ViewerService) {}

  view(viewFile: FileItem): void {
    this.viewer
      .open(
        FilesCollection.uploader,
        viewFile.id,
        this.viewerItems,
        this.suggest,
        this.delete,
        this.download,
        this.readonly,
      )
      .pipe(take(1))
      .subscribe(() => {});
  }
}
