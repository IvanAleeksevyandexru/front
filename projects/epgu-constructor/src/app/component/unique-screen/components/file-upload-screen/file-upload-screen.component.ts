import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { ComponentBase } from '../../../../screen/screen.types';
import { ScreenService } from '../../../../screen/screen.service';
import {
  FileUploadEmitValue,
  FileUploadEmitValueForComponent,
  FileUploadItem,
} from '../../../../shared/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-file-upload-screen',
  templateUrl: './file-upload-screen.component.html',
  styleUrls: ['./file-upload-screen.component.scss'],
})
export class FileUploadScreenComponent {
  @Input() isLoading: boolean;
  @Input() applicantAnswers: object;
  private head: string;
  @Input() set header(header: string) {
    this.head = header;
  }
  get header() {
    return this.head ? this.head : this.data.label;
  }
  private info: ComponentBase;
  @Input() set data(data: ComponentBase) {
    this.info = data;
    this.allMaxFiles = 0;
    // @ts-ignore
    const { attrs: { uploads } = {} } = data;
    this.collectMaxFilesNumber(uploads);
    this.value = {
      id: data.id,
      type: UniqueScreenComponentTypes.fileUploadComponent,
    };
  }
  get data(): ComponentBase {
    return this.info;
  }
  @Input() submitLabel: string;
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
   * Возвращает true если документы в массиве загружены
   * @param uploads - массив сведений о файлов
   * @private
   */
  private isAllFilesUploaded(uploads: FileUploadEmitValue[]): boolean {
    const allUploads = uploads.length;
    const uploadsWithFiles = uploads.filter((fileUploadsInfo) => {
      // Если это зависимые подэлементы для загрузки
      return fileUploadsInfo.relatedUploads
        ? this.isAllFilesUploaded(fileUploadsInfo.relatedUploads.uploads)
        : fileUploadsInfo?.value.filter((file) => file.uploaded).length > 0;
    }).length;

    return allUploads === uploadsWithFiles;
  }

  /**
   * Принимает новое значение от компонентов и провеяет доступность кнопки далее
   * @param $eventData - данные из компонента
   */
  handleNewValueSet($eventData: any) {
    if ($eventData.files.relatedUploads && this.value?.uploads) {
      this.value.uploads = this.value.uploads.map((value: any) => {
        if ($eventData.files.uploadId === value.uploadId) {
          // eslint-disable-next-line no-param-reassign
          value = { ...value, ...$eventData.files };
        }
        return value;
      });
    } else {
      this.value.uploads = $eventData.files;
    }
    this.disabled = !this.isAllFilesUploaded(this.value.uploads);
  }

  /**
   * Переход на следующий экран с отправкой данных
   */
  nextScreen() {
    this.nextStepEvent.emit(JSON.stringify(this.value));
  }
}
