import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import { ModalService, EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
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

@Component({
  selector: 'epgu-constructor-file-upload-screen',
  templateUrl: './file-upload-screen.component.html',
  styleUrls: ['./file-upload-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadScreenComponent implements OnInit {
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  data$: Observable<ComponentBase> = this.screenService.component$.pipe(
    tap((data: ComponentBase) => {
      const attrs: FileUploadAttributes = data.attrs as FileUploadAttributes;
      this.allMaxFiles = 0;

      if (data.type === UniqueScreenComponentTypes.OrderFileProcessingComponent && attrs?.uploads) {
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

      this.collectMaxFilesNumber(attrs?.uploads ?? []);

      this.value = {
        id: data.id,
        type: data.type,
      };
    }),
  );

  header$: Observable<string> = combineLatest([
    this.screenService.component$,
    this.screenService.header$,
  ]).pipe(map(([data, header]: [ComponentBase, string]) => header || data.label));

  disabled$$ = new BehaviorSubject<boolean>(true);
  disabled$ = this.disabled$$.pipe(distinctUntilChanged());
  allMaxFiles = 0; // Максимальное количество файлов, на основе данных форм
  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };
  uploaderProcessing = new BehaviorSubject<string[]>([]);
  uploaderProcessing$ = this.uploaderProcessing.pipe(
    map((list) => list.length > 0),
    distinctUntilChanged(),
    tap((status) => this.screenService.updateLoading(status)),
  );

  private value: FileUploadEmitValueForComponent; // Здесь будет храниться значение на передачу

  constructor(
    public screenService: ScreenService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
    private modalService: ModalService,
  ) {}

  toCSVUploader(upload: FileUploadItem): FileUploadItem {
    const processingUpload = { ...upload, fileType: ['CSV'], maxFileCount: 1 };
    delete processingUpload.maxCountByTypes;
    return processingUpload;
  }

  ngOnInit(): void {
    this.eventBusService
      .on('fileUploadValueChangedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileResponseToBackendUploadsItem) => {
        this.handleNewValueSet(payload);
        this.currentAnswersService.state = this.value;
      });
    this.uploaderProcessing$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();

    this.eventBusService
      .on('UPLOADER_PROCESSING_STATUS')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: { uploadId: string; status: boolean }) =>
        this.setProcessingStatus(payload),
      );
  }

  setProcessingStatus({ uploadId, status }: { uploadId: string; status: boolean }): void {
    const statusList = this.uploaderProcessing.getValue();
    const index = statusList.lastIndexOf(uploadId);
    if (status && index === -1) {
      statusList.push(uploadId);
      this.uploaderProcessing.next(statusList);
    } else if (!status && index !== -1) {
      statusList.splice(index, 1);
      this.uploaderProcessing.next(statusList);
    }
  }

  /**
   * Возвращает префикс для формирования мнемоники
   * @param componentData - данные компонента
   */
  getUploadComponentPrefixForMnemonic(componentData: ComponentBase): string {
    return [componentData.id, 'FileUploadComponent'].join('.');
  }

  /**
   * Возвращает true если все документы загружены
   * @param uploaders - массив загрузчиков с файлами
   * @private
   */
  isAllFilesUploaded(uploaders: FileUploadEmitValue[]): boolean {
    for (let uploaderIndex = 0; uploaderIndex < uploaders.length; uploaderIndex += 1) {
      if (!uploaders[uploaderIndex].value.every((file: UploadedFile) => file.uploaded)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Принимает новое значение от компонентов и провеяет доступность кнопки далее
   * @param $eventData - данные из компонента
   */
  private handleNewValueSet($eventData: FileResponseToBackendUploadsItem): void {
    this.value.uploads = $eventData.files as FileUploadEmitValue[];

    /**
     * Блокируем кнопку если:
     * 1. Не в каждом загрузчике есть файл
     * Или
     * 2. Если не все файлы загрузились на терабайт
     */
    this.disabled$$.next(
      !(
        this.isEveryUploaderHasFile(this.value.uploads) &&
        this.isAllFilesUploaded(this.value.uploads)
      ),
    );
  }

  /**
   * Собираем максимальное число файлов из всех форм
   * @private
   */
  private collectMaxFilesNumber(uploads: FileUploadItem[]): void {
    uploads.forEach((upload) => {
      if (upload?.maxFileCount) {
        this.allMaxFiles += upload.maxFileCount;
      }
    });
  }

  /**
   * Возвращает true если у каждого загрузчика есть хотя бы один загруженный файл
   * @param uploaders - массив загрузчиков с файлами
   * @private
   */
  private isEveryUploaderHasFile(uploaders: FileUploadEmitValue[]): boolean {
    const requiredUploaders = uploaders.filter((uploader) => uploader?.required);
    const totalUploaders = requiredUploaders?.length;

    if (totalUploaders === 0) {
      return false;
    }

    const uploadersWithFiles = requiredUploaders.filter((fileUploaderInfo: FileUploadEmitValue) => {
      return fileUploaderInfo?.value.filter((file: UploadedFile) => file.uploaded).length > 0;
    }).length;

    return totalUploaders === uploadersWithFiles;
  }
}