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
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  ErrorActions,
  FileItem,
  FileItemStatus,
} from '../../shared/components/file-upload/file-upload-item/data';
import { ScreenService } from '../../screen/screen.service';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { UploadedFile } from '../../core/services/terra-byte-api/terra-byte-api.types';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../core/services/autocomplete/autocomplete.inteface';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { DATE_STRING_DASH_FORMAT, DATE_TIME_STRING_SHORT } from '../../shared/constants/dates';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { ConfigService } from '../../core/services/config/config.service';
import { ViewerService } from '../../shared/components/uploader/services/viewer/viewer.service';
import { FilesCollection, iconsTypes, SuggestAction } from '../../shared/components/uploader/data';
import { AutocompleteApiService } from '../../core/services/autocomplete/autocomplete-api.service';
import { AutocompletePrepareService } from '../../core/services/autocomplete/autocomplete-prepare.service';

@Component({
  selector: 'epgu-constructor-attach-uploaded-files-modal',
  templateUrl: './attach-uploaded-files-modal.component.html',
  styleUrls: ['./attach-uploaded-files-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachUploadedFilesModalComponent extends ModalBaseComponent implements OnInit {
  @Input() filesList: FileItem[];
  @Input() modalId: string;
  @Input() acceptTypes: string;

  @Output() delete = new EventEmitter<FileItem>();
  @Output() download = new EventEmitter<FileItem>();
  @Output() suggest = new EventEmitter<SuggestAction>();

  title = 'Ранее загруженные файлы';
  componentId = this.screenService.component?.id || null;
  suggestions: { [key: string]: ISuggestionItem } = {};
  suggestions$ = this.screenService.suggestions$;
  suggestionsFiles: FileItem[] = [];
  suggestionsFilesList: ISuggestionItemList[] = [];
  suggestionsFilesGroupByDate: [string, FileItem[]][] = [];
  fileUploadApiUrl = this.configService.fileUploadApiUrl;
  basePath = `${this.configService.staticDomainAssetsPath}/assets/icons/svg/file-types/`;
  iconsTypes = iconsTypes;

  constructor(
    public injector: Injector,
    private screenService: ScreenService,
    private datesToolsService: DatesToolsService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private configService: ConfigService,
    private viewerService: ViewerService,
    private autocompleteApiService: AutocompleteApiService,
    private autocompletePrepareService: AutocompletePrepareService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.suggestions$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((suggestions) => {
      this.suggestions = suggestions;
      this.suggestionsFilesList = (suggestions && suggestions[this.componentId]?.list) || [];
      const suggestionsUploadedFiles = this.autocompletePrepareService.getParsedSuggestionsUploadedFiles(
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

    this.delete.subscribe((payload) => {
      this.eventBusService.emit(`fileDeleteEvent_${this.modalId}`, payload);
    });

    this.download.subscribe((payload) => {
      this.eventBusService.emit(`fileDownloadEvent_${this.modalId}`, payload);
    });

    this.suggest.subscribe((payload) => {
      this.eventBusService.emit(`fileSuggestEvent_${this.modalId}`, payload);
    });
  }

  public previewFile(file: FileItem): void {
    this.viewerService
      .open(
        FilesCollection.suggest,
        file.id,
        of(this.suggestionsFiles),
        this.suggest,
        this.delete,
        this.download,
      )
      .pipe(take(1))
      .subscribe();
  }

  public handleImgError(event: Event, file: FileItem): void {
    const target = event.target as HTMLImageElement;
    target.src = `${this.basePath}${this.iconsTypes.error}.svg`;
    file.setError({ type: ErrorActions.addInvalidFile, text: 'Что-то пошло не так' });
    // TODO: убрать костыль ниже, когда придумают, что делать с битыми файлами
    // Контекст боли тут: https://jira.egovdev.ru/browse/EPGUCORE-54485
    this.suggestionsFilesGroupByDate.some((group) => {
      const fileIndex = group[1].findIndex((gFile) => gFile.id === file.id);
      if (fileIndex > -1) {
        group[1].splice(fileIndex, 1);
        return true;
      }
      return false;
    });
  }

  private handleFileDeleted(file: FileItem): void {
    const deletedFileId = file.item.fileUid;
    let valueGroupId: number;
    let mnemonic: string;
    let newValue: string;

    const updatedSuggestionsFilesList = this.suggestionsFilesList.map((item) => {
      const parsedValue = item?.originalItem && JSON.parse(item.originalItem);
      const fileToDeleteIdx = parsedValue.uploads[0].value.findIndex(
        (uploadedFileValue: UploadedFile) => uploadedFileValue.fileUid === deletedFileId,
      );
      if (fileToDeleteIdx > -1) {
        parsedValue.uploads[0].value.splice(fileToDeleteIdx, 1);
        valueGroupId = item.id;
        mnemonic = item.mnemonic;
      }
      newValue = JSON.stringify(parsedValue);
      const newItem = { ...item, originalItem: newValue };
      return newItem;
    });
    this.suggestions[this.componentId].list = updatedSuggestionsFilesList;
    this.autocompleteApiService.updateSuggestionField(valueGroupId, mnemonic, newValue).subscribe();
  }

  private getSuggestionFiles(suggestionsUploadedFiles: UploadedFile[]): FileItem[] {
    return suggestionsUploadedFiles.reduce((acc: FileItem[], file: UploadedFile): FileItem[] => {
      if (this.isIncludedToList(file)) {
        const resultFile = new FileItem(
          FileItemStatus.uploaded,
          `${this.fileUploadApiUrl}/`,
          null,
          file,
        );
        if (this.filesList.some((fileItem) => fileItem.item.fileUid === resultFile.item.fileUid)) {
          resultFile.setAttached(true);
        }
        return [...acc, resultFile];
      }

      return acc;
    }, []);
  }

  private isIncludedToList(file: UploadedFile): boolean {
    return (
      file.mnemonic.includes(this.modalId) &&
      this.acceptTypes.toLowerCase().includes(file.fileExt.toLocaleLowerCase())
    );
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
}
