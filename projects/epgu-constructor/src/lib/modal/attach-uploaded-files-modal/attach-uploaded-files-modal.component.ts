import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { catchError, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  ConfigService,
  DATE_STRING_DASH_FORMAT,
  DATE_TIME_STRING_SHORT,
  DatesToolsService,
  EventBusService,
  ModalBaseComponent,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ErrorActions, FileItem, FileItemStatus } from '../../shared/components/file-upload/data';
import { ScreenService } from '../../screen/screen.service';
import { UploadedFile } from '../../core/services/terra-byte-api/terra-byte-api.types';
import { ViewerService } from '../../shared/components/uploader/services/viewer/viewer.service';
import { FilesCollection, iconsTypes, SuggestAction } from '../../shared/components/uploader/data';
import { TerraByteApiService } from '../../core/services/terra-byte-api/terra-byte-api.service';

@Component({
  selector: 'epgu-constructor-attach-uploaded-files-modal',
  templateUrl: './attach-uploaded-files-modal.component.html',
  styleUrls: ['./attach-uploaded-files-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachUploadedFilesModalComponent extends ModalBaseComponent implements OnInit {
  @Input() filesList: FileItem[] = [];
  @Input() galleryFilesList$: Observable<UploadedFile[]> = new BehaviorSubject([]);
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
    private teraService: TerraByteApiService,
    private cdRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.galleryFilesList$
      .pipe(
        map((files) => this.getGalleryFiles(files)),
        switchMap((files) =>
          combineLatest(
            files.map((file) =>
              file.isImage
                ? this.teraService
                    .downloadFile({
                      objectId: file.item.objectId,
                      objectType: file.item.objectType,
                      mnemonic: file.item.mnemonic,
                      mimeType: file.item.mimeType,
                    })
                    .pipe(
                      map(
                        (blob) =>
                          new FileItem(
                            FileItemStatus.uploaded,
                            `${this.fileUploadApiUrl}/`,
                            new File([blob], file.item.fileName),
                            file.item,
                          ),
                      ),
                      catchError(() =>
                        of(
                          new FileItem(
                            FileItemStatus.error,
                            `${this.fileUploadApiUrl}/`,
                            null,
                            file.item,
                          ).setError({
                            type: ErrorActions.addInvalidFile,
                            text: 'Что-то пошло не так',
                          }),
                        ),
                      ),
                    )
                : of(file),
            ),
          ),
        ),
      )
      .subscribe((galleryFilesList) => {
        this.galleryFiles = galleryFilesList;
        this.galleryFilesGroupByDate = this.getGalleryFilesGroupedByDate(this.galleryFiles);
        this.cdRef.markForCheck();
      });

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
