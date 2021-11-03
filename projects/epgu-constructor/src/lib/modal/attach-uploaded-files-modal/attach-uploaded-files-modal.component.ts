import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ModalBaseComponent,
  UnsubscribeService,
  EventBusService,
  ConfigService,
  DatesToolsService,
  DATE_STRING_DASH_FORMAT,
  DATE_TIME_STRING_SHORT,
} from '@epgu/epgu-constructor-ui-kit';
import { ErrorActions, FileItem, FileItemStatus } from '../../shared/components/file-upload/data';
import { ScreenService } from '../../screen/screen.service';
import { UploadedFile } from '../../core/services/terra-byte-api/terra-byte-api.types';
import { ViewerService } from '../../shared/components/uploader/services/viewer/viewer.service';
import { FilesCollection, iconsTypes, SuggestAction } from '../../shared/components/uploader/data';

@Component({
  selector: 'epgu-constructor-attach-uploaded-files-modal',
  templateUrl: './attach-uploaded-files-modal.component.html',
  styleUrls: ['./attach-uploaded-files-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachUploadedFilesModalComponent extends ModalBaseComponent implements OnInit {
  @Input() filesList: FileItem[] = [];
  @Input() galleryFilesList: UploadedFile[] = [];
  @Input() modalId: string;
  @Input() acceptTypes: string;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();

  title = 'Ранее загруженные файлы';
  componentId = this.screenService.component?.id || null;
  galleryFiles: FileItem[] = [];
  galleryFilesGroupByDate: [string, FileItem[]][] = [];
  fileUploadApiUrl = this.configService.fileUploadApiUrl;
  basePath = `${this.configService.staticDomainAssetsPath}/assets/icons/svg/file-types/`;
  iconsTypes = iconsTypes;

  constructor(
    public injector: Injector,
    public config: ConfigService,
    private screenService: ScreenService,
    private datesToolsService: DatesToolsService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private configService: ConfigService,
    private viewerService: ViewerService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.galleryFiles = this.getGalleryFiles(this.galleryFilesList);
    this.galleryFilesGroupByDate = this.getGalleryFilesGroupedByDate(this.galleryFiles);

    this.eventBusService
      .on('closeModalEvent_previewFiles')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });

    this.delete.subscribe((payload) => {
      this.eventBusService.emit(`fileDeleteEvent_${this.modalId}`, payload);
    });

    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.download.subscribe((payload) => {
      this.eventBusService.emit(`fileDownloadEvent_${this.modalId}`, payload);
    });

    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.suggest.subscribe((payload) => {
      this.eventBusService.emit(`fileSuggestEvent_${this.modalId}`, payload);
    });
  }

  public previewFile(file: FileItem): void {
    this.viewerService
      .open(
        FilesCollection.suggest,
        file.id,
        of(this.galleryFiles),
        this.suggest,
        this.delete,
        this.download,
      )
      .pipe(take(1))
      .subscribe();
  }

  public getImgSrc(file: FileItem): string {
    const urlTemplate = (type: number): string =>
      `${this.fileUploadApiUrl}/${file.item.objectId}/${type}/download?mnemonic=${file.item.mnemonic}`;

    return urlTemplate(file.item.previewType || file.item.objectTypeId);
  }

  public handleImgError(event: Event, file: FileItem): void {
    const target = event.target as HTMLImageElement;
    target.src = `${this.basePath}${this.iconsTypes.error}.svg`;
    file.setError({ type: ErrorActions.addInvalidFile, text: 'Что-то пошло не так' });
    // TODO: убрать костыль ниже, когда придумают, что делать с битыми файлами
    // Контекст боли тут: https://jira.egovdev.ru/browse/EPGUCORE-54485
    this.galleryFilesGroupByDate.some((group) => {
      const fileIndex = group[1].findIndex((gFile) => gFile.id === file.id);
      if (fileIndex > -1) {
        group[1].splice(fileIndex, 1);
        return true;
      }
      return false;
    });
  }

  private getGalleryFiles(galleryFiles: UploadedFile[]): FileItem[] {
    return galleryFiles.reduce((acc: FileItem[], file: UploadedFile): FileItem[] => {
      if (this.isIncludedToList(file)) {
        const resultFile: FileItem = new FileItem(
          FileItemStatus.uploaded,
          `${this.fileUploadApiUrl}/`,
          null,
          file,
        );
        if (this.filesList.some((fileItem) => this.isSameFile(fileItem, resultFile))) {
          resultFile.setAttached(true);
        }
        return [...acc, resultFile];
      }

      return acc;
    }, []);
  }

  private isIncludedToList(file: UploadedFile): boolean {
    return this.acceptTypes.toLowerCase().includes(file.fileExt?.toLocaleLowerCase());
  }

  private isSameFile(fileItem: FileItem, resultFile: FileItem): boolean {
    return (
      fileItem.item.objectId === resultFile.item.objectId &&
      fileItem.item.objectType === resultFile.item.objectType &&
      fileItem.item.mnemonic === resultFile.item.mnemonic
    );
  }

  private getGalleryFilesGroupedByDate(galleryFiles: FileItem[]): [string, FileItem[]][] {
    return Object.entries(
      galleryFiles.reduce((acc, file) => {
        let date: Date | string = this.datesToolsService.parse(
          file.item.created,
          DATE_STRING_DASH_FORMAT,
        );
        date = this.datesToolsService.format(date, DATE_TIME_STRING_SHORT);
        if (acc[date]) {
          acc[date].push(file);
        } else {
          acc[date] = [file];
        }
        return acc;
      }, {}),
    );
  }
}
