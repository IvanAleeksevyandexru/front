import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { ComponentBase } from '../../../../screen/screen.types';
import { ScreenService } from '../../../../screen/screen.service';
import {
  FileUploadEmitValue,
  FileUploadEmitValueForComponent,
  FileUploadItem,
} from '../../../../shared/services/terra-byte-api/terra-byte-api.types';
import { TerraUploadedFile } from './sub-components/file-upload-item/data';
import { ApplicantAnswersDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-file-upload-screen',
  templateUrl: './file-upload-screen.component.html',
  styleUrls: ['./file-upload-screen.component.scss'],
})
export class FileUploadScreenComponent {
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

  header$: Observable<string> = combineLatest([this.data$, this.screenService.header$]).pipe(
    map(([data, header]: [ComponentBase, string]) => header || data.label),
  );

  @Output() nextStepEvent = new EventEmitter();

  disabled = true;
  allMaxFiles = 0; // Максимальное количество файлов, на основе данных форм
  private value: FileUploadEmitValueForComponent; // Здесь будет храниться значение на передачу

  constructor(public screenService: ScreenService) {}

  /**
   * Возвращает префикс для формирования мнемоники
   * @param componentData - данные компонента
   */
  getUploadComponentPrefixForMnemonic(componentData: ComponentBase): string {
    return [componentData.id, 'FileUploadComponent'].join('.');
  }

  /**
   * Собираем максимальное число файлов из всех форм
   * @private
   */
  private collectMaxFilesNumber(uploads: FileUploadItem[]) {
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
    const totalUploaders = uploaders?.length;
    const uploadersWithFiles = uploaders?.filter((fileUploaderInfo: FileUploadEmitValue) => {
      // Если это зависимые подэлементы для загрузки
      return fileUploaderInfo.relatedUploads
        ? this.isEveryUploaderHasFile(fileUploaderInfo.relatedUploads.uploads)
        : fileUploaderInfo?.value.filter((file: TerraUploadedFile) => file.uploaded).length > 0;
    }).length;

    return totalUploaders === uploadersWithFiles;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleNewValueSet($eventData: any) {
    if ($eventData.relatedUploads && this.value?.uploads) {
      this.value.uploads = this.value.uploads.map((value: FileUploadEmitValue) => {
        if ($eventData.uploadId === value.uploadId) {
          // eslint-disable-next-line no-param-reassign
          value = { ...value, relatedUploads: $eventData.relatedUploads };
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
     * И
     * 2. Если не все файлы загрузились на терабайт
     */
    this.disabled = !(
      this.isEveryUploaderHasFile(this.value.uploads) && this.isAllFilesUploaded(this.value.uploads)
    );
  }

  /**
   * Переход на следующий экран с отправкой данных
   */
  nextScreen() {
    this.nextStepEvent.emit(JSON.stringify(this.value));
  }
}
