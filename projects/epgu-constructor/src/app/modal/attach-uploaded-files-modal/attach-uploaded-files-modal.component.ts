import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  FileItem,
  FileItemStatus,
} from '../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { ScreenService } from '../../screen/screen.service';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { UploadedFile } from '../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';
import { ISuggestionItemList } from '../../core/services/autocomplete/autocomplete.inteface';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { DATE_STRING_DASH_FORMAT, DATE_TIME_STRING_SHORT } from '../../shared/constants/dates';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { ConfigService } from '../../core/services/config/config.service';
import { ICONS_TYPES } from '../../shared/constants/uploader';

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
  suggestions$ = this.screenService.suggestions$;
  suggestionsFiles: FileItem[] = [];
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
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.suggestions$.subscribe((suggestions) => {
      const suggestionsFilesList: ISuggestionItemList[] =
        (suggestions && suggestions[this.componentId]?.list) || [];
      const suggestionsUploadedFiles = this.getParsedSuggestionsUploadedFiles(suggestionsFilesList);
      this.suggestionsFiles = this.getSuggestionFiles(suggestionsUploadedFiles);
      this.suggestionsFilesGroupByDate = this.getSuggestionsFilesGroupedByDate(
        this.suggestionsFiles,
      );
      console.log(this.suggestionsFilesGroupByDate, this.suggestionsFiles);
    });

    this.eventBusService
      .on('closeModalEvent_previewFiles')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  public previewFile(file: FileItem): void {
    this.eventBusService.emit('previewFileEvent', file);
  }

  public handleImgError(event): void {
    const { target } = event;
    target.src = `${this.configService.staticDomainAssetsPath}/assets/icons/svg/image-error.svg`;
  }

  private getSuggestionFiles(suggestionsUploadedFiles: UploadedFile[]): FileItem[] {
    return suggestionsUploadedFiles.map(
      (file: UploadedFile) => new FileItem(FileItemStatus.uploaded, null, file),
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
