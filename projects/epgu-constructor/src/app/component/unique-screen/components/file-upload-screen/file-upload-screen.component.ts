import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import {
  ActionType,
  ApplicantAnswersDto,
  ComponentActionDto,
  DTOActionAction,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import {
  FileResponseToBackendUploadsItem,
  FileUploadEmitValue,
  FileUploadEmitValueForComponent,
  FileUploadItem,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { TerraUploadedFile } from '../../../../shared/components/file-upload/file-upload-item/data';

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
      this.allMaxFiles = 0;
      // @ts-ignore
      const { attrs: { uploads } = {} } = data;
      this.collectMaxFilesNumber(uploads);
      this.value = {
        id: data.id,
        type: UniqueScreenComponentTypes.fileUploadComponent,
      };
    }),
  );
  applicantAnswers$: Observable<ApplicantAnswersDto> = this.screenService.applicantAnswers$;
  submitLabel$: Observable<string> = this.screenService.submitLabel$;
  header$: Observable<string> = combineLatest([
    this.screenService.component$,
    this.screenService.header$,
  ]).pipe(map(([data, header]: [ComponentBase, string]) => header || data.label));

  disabled = new BehaviorSubject<boolean>(true);
  allMaxFiles = 0; // Максимальное количество файлов, на основе данных форм
  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };
  private value: FileUploadEmitValueForComponent; // Здесь будет храниться значение на передачу

  constructor(
    public screenService: ScreenService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.eventBusService
      .on('fileUploadValueChangedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileResponseToBackendUploadsItem) => {
        this.handleNewValueSet(payload);
        this.currentAnswersService.state = this.value;
        this.cdr.markForCheck();
      });
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
      if (!uploaders[uploaderIndex].value.every((file: TerraUploadedFile) => file.uploaded)) {
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
    if ($eventData.relatedUploads && this.value?.uploads) {
      this.value.uploads = this.value.uploads.map((value: FileUploadEmitValue) => {
        if ($eventData.uploadId === value.uploadId) {
          return {
            ...value,
            relatedUploads: $eventData.relatedUploads,
            required: $eventData.required,
          } as FileUploadEmitValue;
        }
        return value;
      });
    } else {
      const relatedUpload: FileUploadEmitValue = this.value.uploads?.find(
        (value: FileUploadEmitValue) => value.relatedUploads,
      );

      this.value.uploads = $eventData.files?.map((value: FileUploadEmitValue) => {
        let resultValue = value;
        if (relatedUpload && value?.uploadId === relatedUpload.uploadId) {
          resultValue = { ...value, relatedUploads: relatedUpload.relatedUploads };
        }

        return resultValue;
      });
    }
    /**
     * Блокируем кнопку если:
     * 1. Не в каждом загрузчике есть файл
     * Или
     * 2. Если не все файлы загрузились на терабайт
     */
    this.disabled.next(
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
      if (upload?.relatedUploads?.uploads) {
        this.collectMaxFilesNumber(upload.relatedUploads.uploads);
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
      // Если это зависимые подэлементы для загрузки
      return fileUploaderInfo.relatedUploads
        ? this.isEveryUploaderHasFile(fileUploaderInfo.relatedUploads.uploads)
        : fileUploaderInfo?.value.filter((file: TerraUploadedFile) => file.uploaded).length > 0;
    }).length;

    return totalUploaders === uploadersWithFiles;
  }
}
