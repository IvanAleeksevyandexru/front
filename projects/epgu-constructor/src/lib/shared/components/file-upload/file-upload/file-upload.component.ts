import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  reduce,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, combineLatest, from, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BusEventType, EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import {
  FileResponseToBackendUploadsItem,
  FileUploadAttributes,
  FileUploadItem,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { ScreenService } from '../../../../screen/screen.service';
import { UploaderLimitsService } from '../services/limits/uploader-limits.service';
import { UploadContext } from '../data';

@Component({
  selector: 'epgu-constructor-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [UnsubscribeService, UploaderLimitsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit {
  @Input()
  set objectId(id: string) {
    this._objectId.next(id);
  }
  get objectId(): string {
    return this._objectId.getValue();
  }
  @Input() prefixForMnemonic: string;
  @Input() uploadId: string = null;
  @Input()
  set attributes(attrs: FileUploadAttributes) {
    this.attrs.next(attrs);
    this.value.files = this.fillUploadsDefaultValue();
    this.eventBusService.emit(BusEventType.FileUploadValueChangedEvent, this.value);
  }
  get attributes(): FileUploadAttributes {
    return this.attrs.getValue();
  }

  attrs = new BehaviorSubject<FileUploadAttributes>(null);
  attrs$ = this.attrs.pipe(filter((attrs) => !!attrs));
  _objectId = new BehaviorSubject<string>(null);
  _objectId$ = this._objectId.pipe(
    filter((objectId) => !!objectId),
    distinctUntilChanged(),
  );

  componentId = this.screenService.component?.id || null;

  getFilesList$ = combineLatest([this._objectId$, this.screenService.display$]).pipe(
    map(([objectId]) => objectId),
    concatMap(
      (objectId: string) =>
        this.api
          .getListByObjectId(objectId)
          .pipe(
            catchError((e: HttpErrorResponse) => (e.status === 404 ? of([]) : throwError(e))),
          ) as Observable<UploadedFile[]>,
    ),
    concatMap((files: UploadedFile[]) =>
      from(files).pipe(
        reduce<UploadedFile, Record<string, UploadedFile[]>>((acc, value) => {
          const id = this.getMnemonicWithoutOrder(value.mnemonic);
          if (!acc[id]) {
            acc[id] = [];
          }
          if (this) acc[id].push(value);

          return acc;
        }, {}),
      ),
    ),
  );

  getGalleryList$ = this.screenService.display$.pipe(
    switchMap((display) => display.components),
    concatMap((component: ComponentDto) =>
      this.api
        .getGalleryByMnemonic(component.suggestionId)
        .pipe(catchError((e: HttpErrorResponse) => (e.status === 404 ? of([]) : throwError(e)))),
    ),
    tap((files: UploadedFile[]) =>
      files.forEach((file: UploadedFile) => this.markSuggestFile(file)),
    ),
  );

  uploads$ = combineLatest([this.attrs$, this.getFilesList$, this.getGalleryList$]);

  private value: FileResponseToBackendUploadsItem = { files: [], errors: [] };

  constructor(
    public limits: UploaderLimitsService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private api: TerraByteApiService,
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.setUploadersRestrictions();

    this.eventBusService
      .on('fileUploadItemValueChangedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileResponseToBackendUploadsItem) => {
        this.handleNewValueForItem(payload);
        this.cdr.markForCheck();
      });
  }

  public getUploadContext([upload, files, galleryFiles]: [
    FileUploadItem,
    Record<string, UploadedFile[]>,
    Record<string, UploadedFile[]>,
  ]): UploadContext {
    const id = `${this.prefixForMnemonic}.${upload.uploadId}`;

    return {
      data: upload,
      prefixForMnemonic: this.prefixForMnemonic,
      objectId: this.objectId,
      clarifications: this.attributes?.clarifications,
      files: files[id] || [],
      galleryFiles: galleryFiles || [],
    } as UploadContext;
  }

  private getMnemonicWithoutOrder(mnemonic: string): string {
    const result = mnemonic.match(/\.[0-9]*$/);
    return result ? mnemonic.replace(result[0], '') : mnemonic;
  }

  private setUploadersRestrictions(): void {
    this.setTotalMaxSizeAndAmount(this.attributes.maxSize, this.attributes.maxFileCount);

    this.attributes.uploads?.forEach(
      ({ uploadId, maxSize, maxCountByTypes, maxFileCount }: FileUploadItem) => {
        this.limits.registerUploader(
          uploadId,
          maxCountByTypes?.length > 0 || !maxFileCount ? 0 : maxFileCount,
          maxSize,
        );
      },
    );
  }

  private setTotalMaxSizeAndAmount(maxSize: number, maxAmount: number): void {
    if (maxSize) {
      this.limits.setTotalMaxSize(maxSize);
    }
    if (maxAmount) {
      this.limits.setTotalMaxAmount(maxAmount);
    }
  }

  /**
   * ???????????????????????? ?????????? ???????????????? ???? ?????????? ????????????????
   * @param $eventData - ?????????? ???????????????? ???? ??????????
   */
  private handleNewValueForItem($eventData: FileResponseToBackendUploadsItem): void {
    this.value.files = this.value.files.map((valueItem: FileResponseToBackendUploadsItem) => {
      const value = { ...valueItem };
      if (valueItem.uploadId === $eventData.uploadId) {
        value.value = $eventData.value;
        value.required = $eventData.required;
      }
      return value;
    });
    this.value.errors = $eventData.errors;

    this.eventBusService.emit(BusEventType.FileUploadValueChangedEvent, this.value);
  }

  /**
   * ???????????????? ???????? ?????????????????????? ?????????????? ?????? ??????????????-??????????????
   * @private
   */
  private markSuggestFile(file: UploadedFile): UploadedFile {
    // eslint-disable-next-line no-param-reassign
    file.isFromSuggests = true;
    return file;
  }

  /**
   * ?????????????????? ???????????????? ???? ?????????????????? ?????? ???????????????? ???? ????????????
   * @private
   */
  private fillUploadsDefaultValue(): FileResponseToBackendUploadsItem[] {
    const value: FileResponseToBackendUploadsItem[] = [];
    this.attributes?.uploads?.forEach((upload: FileUploadItem) => {
      const pdfFileName = upload?.pdfFileName ? { pdfFileName: upload?.pdfFileName } : {};
      const newValue: FileResponseToBackendUploadsItem = {
        uploadId: upload.uploadId,
        value: [],
        ...pdfFileName,
      };
      value.push(newValue);
    });
    return value;
  }
}
