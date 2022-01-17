import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import {
  ModalService,
  EventBusService,
  UnsubscribeService,
  BusEventType,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import {
  FileResponseToBackendUploadsItem,
  FileUploadAttributes,
  FileUploadEmitValue,
  FileUploadEmitValueForComponent,
  FileUploadItem,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { UploaderScreenService } from '../../../../shared/components/file-upload/services/screen/uploader-screen.service';
import { UniqueScreenService } from '../../unique-screen.service';

@Component({
  selector: 'epgu-constructor-file-upload-screen',
  templateUrl: './file-upload-screen.component.html',
  styleUrls: ['./file-upload-screen.component.scss'],
  providers: [UnsubscribeService, UniqueScreenService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadScreenComponent implements OnInit {
  data$: Observable<ComponentBase> = this.screenService.component$.pipe(
    tap((data: ComponentBase) => {
      const attrs: FileUploadAttributes = data.attrs as FileUploadAttributes;

      this.uploaderScreenService.setValuesFromAttrs(attrs);

      if (data.type === UniqueScreenComponentTypes.orderFileProcessingComponent && attrs?.uploads) {
        attrs.maxFileCount = attrs.uploads?.length ?? 0;
        attrs.uploads = attrs.uploads.map((upload) => this.toCSVUploader(upload));
        if (this.screenService.componentError) {
          this.modalService.openModal(ConfirmationModalComponent, {
            text: this.screenService.componentError,
            title: 'Ошибка',
            showCloseButton: false,
            showCrossButton: true,
            buttons: [
              {
                label: 'Закрыть',
                closeModal: true,
              },
            ],
            isShortModal: true,
          });
        }
      }

      this.value = {
        id: data.id,
        type: data.type,
      };
    }),
  );
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  uploaderProcessing = new BehaviorSubject<string[]>([]);
  uploaderProcessing$ = this.uploaderProcessing.pipe(
    map((list) => list.length > 0),
    distinctUntilChanged(),
    tap((status) => this.screenService.updateLoading(status)),
  );
  disabled$$ = new BehaviorSubject<boolean>(true);
  disabled$ = this.disabled$$.pipe(distinctUntilChanged());
  header$: Observable<string> = combineLatest([
    this.screenService.component$,
    this.screenService.header$,
  ]).pipe(map(([data, header]: [ComponentBase, string]) => header || data.label));

  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };

  private value: FileUploadEmitValueForComponent; // Здесь хранится значение на передачу

  constructor(
    public screenService: ScreenService,
    private uniqueScreenService: UniqueScreenService,
    public uploaderScreenService: UploaderScreenService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  toCSVUploader(upload: FileUploadItem): FileUploadItem {
    const processingUpload = { ...upload, fileType: ['CSV'], maxFileCount: 1 };
    delete processingUpload.maxCountByTypes;
    return processingUpload;
  }

  ngOnInit(): void {
    this.eventBusService
      .on(BusEventType.FileUploadValueChangedEvent)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileResponseToBackendUploadsItem) => {
        this.handleNewValueSet(payload);
        this.currentAnswersService.state = this.value;
        this.uploaderScreenService.updateLimits();
        if (this.uploaderScreenService.showLimitsInfo()) {
          window.requestAnimationFrame(() => this.cdr.detectChanges());
        }
      });

    this.uploaderProcessing$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();

    this.eventBusService
      .on(BusEventType.UploaderProcessingStatus)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: { uploadId: string; status: boolean }) =>
        this.uniqueScreenService.setProcessingStatus(payload, this.uploaderProcessing),
      );
  }

  /**
   * Возвращает префикс для формирования мнемоники
   * @param componentData - данные компонента
   */
  getUploadComponentPrefixForMnemonic(componentData: ComponentBase): string {
    return [componentData.id, 'FileUploadComponent'].join('.');
  }

  /**
   * Принимает новое значение от компонентов и проверяет доступность кнопки далее
   * @param $eventData - данные из компонента
   */
  private handleNewValueSet($eventData: FileResponseToBackendUploadsItem): void {
    this.value.uploads = $eventData.files as FileUploadEmitValue[];
    this.uploaderScreenService.calculateСurrentFiles(this.value.uploads);
    this.value.totalCount = this.uploaderScreenService.getCurrentFilesCount();
    this.value.totalSize = this.uploaderScreenService.getCurrentFilesSize();

    this.disabled$$.next(this.isNextStepDisabled($eventData));
  }

  /**
   * Блокируем кнопку если:
   * 1. Есть ошибки
   * 2. Не в каждом обязательном загрузчике есть файл
   * 3. Не все файлы загрузились на терабайт
   */
  private isNextStepDisabled($eventData: FileResponseToBackendUploadsItem): boolean {
    return !(
      $eventData.errors.length === 0 &&
      this.isEveryRequiredUploaderHasFile(this.value.uploads) &&
      this.isAllFilesUploaded(this.value.uploads)
    );
  }

  private getRequiredUploaders(uploaders: FileUploadEmitValue[]): FileUploadEmitValue[] {
    return uploaders.filter((uploader) => uploader?.required);
  }

  /**
   * Возвращает true если у каждого обязательного загрузчика есть хотя бы один загруженный файл
   * @param uploaders - массив загрузчиков с файлами
   * @private
   */
  private isEveryRequiredUploaderHasFile(uploaders: FileUploadEmitValue[]): boolean {
    const requiredUploaders = this.getRequiredUploaders(uploaders);

    const uploadersWithFiles = requiredUploaders.filter((fileUploaderInfo: FileUploadEmitValue) => {
      return fileUploaderInfo?.value.filter((file: UploadedFile) => file.uploaded).length > 0;
    }).length;

    return requiredUploaders.length === uploadersWithFiles;
  }

  /**
   * Возвращает true если все документы загружены
   * @param uploaders - массив загрузчиков с файлами
   * @private
   */
  private isAllFilesUploaded(uploaders: FileUploadEmitValue[]): boolean {
    for (let uploaderIndex = 0; uploaderIndex < uploaders.length; uploaderIndex += 1) {
      if (!uploaders[uploaderIndex].value.every((file: UploadedFile) => file.uploaded)) {
        return false;
      }
    }
    return true;
  }
}
