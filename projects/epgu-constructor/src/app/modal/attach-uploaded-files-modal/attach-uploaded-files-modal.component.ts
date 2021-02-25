import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  ErrorActions,
  FileItem,
  FileItemStatus,
} from '../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { ScreenService } from '../../screen/screen.service';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { UploadedFile } from '../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../core/services/autocomplete/autocomplete.inteface';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { DATE_STRING_DASH_FORMAT, DATE_TIME_STRING_SHORT } from '../../shared/constants/dates';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { ConfigService } from '../../core/services/config/config.service';
import { ICONS_TYPES } from '../../shared/constants/uploader';
import { ViewerService } from '../../shared/components/uploader/services/viewer/viewer.service';
import { FilesCollection } from '../../shared/components/uploader/data';

@Component({
  selector: 'epgu-constructor-attach-uploaded-files-modal',
  templateUrl: './attach-uploaded-files-modal.component.html',
  styleUrls: ['./attach-uploaded-files-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachUploadedFilesModalComponent extends ModalBaseComponent implements OnInit {
  @Input() filesList: FileItem[];
  title = 'Ранее загруженные файлы';
  componentId = this.screenService.component?.id || null;
  suggestions: { [key: string]: ISuggestionItem } = {};
  suggestions$ = this.screenService.suggestions$;
  suggestionsFiles: FileItem[] = [];
  suggestionsFilesList: ISuggestionItemList[] = [];
  suggestionsFilesGroupByDate: [string, FileItem[]][] = [];
  fileUploadApiUrl = this.configService.fileUploadApiUrl;
  basePath = `${this.configService.staticDomainAssetsPath}/assets/icons/svg/file-types/`;
  iconsTypes = ICONS_TYPES;

  constructor(
    public injector: Injector,
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
    this.suggestions$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((suggestions) => {
      this.suggestions = suggestions;
      this.suggestionsFilesList = (suggestions && suggestions[this.componentId]?.list) || [];
      const suggestionsUploadedFiles = this.getParsedSuggestionsUploadedFiles(
        this.suggestionsFilesList,
      );
      this.suggestionsFiles = this.getSuggestionFiles(suggestionsUploadedFiles);
      this.suggestionsFilesGroupByDate = this.getSuggestionsFilesGroupedByDate(
        this.suggestionsFiles,
      );
    });

    this.eventBusService
      .on('closeModalEvent_previewFiles')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });

    this.eventBusService
      .on('fileDeletedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => this.handleFileDeleted(payload));
  }

  public previewFile(file: FileItem): void {
    this.viewerService
      .open(FilesCollection.suggest, file.id, this.suggestionsFiles)
      .pipe(take(1))
      .subscribe();
  }

  public handleImgError(event: Event, file: FileItem): void {
    const target = event.target as HTMLImageElement;
    target.src = `${this.basePath}${this.iconsTypes.error}.svg`;
    file.setError({ type: ErrorActions.addInvalidFile, text: 'Что-то пошло не так' });
  }

  private handleFileDeleted(file: FileItem): void {
    // TODO: доделать, когда будет готова ручка на беке микросервиса саджестов
    const deletedFileId = file.item.fileUid;
    const updatedSuggestionsFilesList = this.suggestionsFilesList.map((item) => {
      const parsedValue = item?.originalItem && JSON.parse(item.originalItem);
      parsedValue?.uploads.filter(
        (uploadedFile: UploadedFile) => uploadedFile.fileUid !== deletedFileId,
      );
      const newItem = { ...item, originalItem: JSON.stringify(parsedValue) };
      return newItem;
    });
    this.suggestions[this.componentId].list = updatedSuggestionsFilesList;
    const result = this.suggestions[this.componentId];
    // this.autocompleteApiService.updateFile(result).subscribe();
  }

  private getSuggestionFiles(suggestionsUploadedFiles: UploadedFile[]): FileItem[] {
    return suggestionsUploadedFiles.map((file: UploadedFile) => {
      const resultFile = new FileItem(
        FileItemStatus.uploaded,
        `${this.fileUploadApiUrl}/`,
        null,
        file,
      );
      if (this.filesList.some((fileItem) => fileItem.item.mnemonic === resultFile.item.mnemonic)) {
        resultFile.setAttached(true);
      }
      return resultFile;
    });
  }

  private getSuggestionsFilesGroupedByDate(suggestionsFiles: FileItem[]): [string, FileItem[]][] {
    return Object.entries(
      suggestionsFiles.reduce((acc, file) => {
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

  private getParsedSuggestionsUploadedFiles(componentList: ISuggestionItemList[]): UploadedFile[] {
    return componentList.reduce((result, item) => {
      const parsedValue = item?.originalItem && JSON.parse(item.originalItem);
      const componentValues = [
        ...parsedValue?.uploads.reduce((acc, upload) => {
          acc.push(...upload.value);
          return acc;
        }, []),
      ];
      return [...result, ...componentValues];
    }, []);
  }
}
