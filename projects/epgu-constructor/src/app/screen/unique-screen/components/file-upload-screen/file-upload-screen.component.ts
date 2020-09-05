import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentBase } from '../../../../services/api/form-player-api/form-player-api.types';
import { UNIQUE_COMPONENT_NAME } from '../../../../../constant/global';
import { IFileUploadItem } from '../../../../../interfaces/terabyte.interface';

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
      type: UNIQUE_COMPONENT_NAME.fileUploadComponent,
    };
  }
  get data(): ComponentBase {
    return this.info;
  }
  @Input() submitLabel: string;
  @Output() nextStepEvent = new EventEmitter();

  allMaxFiles = 0; // Максимальное количество файлов, на основе данных форм
  private value: any = {}; // Здесь будет храниться значение на передачу

  /**
   * Возвращает префикс для формирования мнемоники
   * @param componentData - данные компонента
   */
  getUploadComponentPrefixForMnemonic(componentData: ComponentBase): string {
    return [componentData.id, 'FileUploadComponent'].join('.');
  }

  /**
   * Возвращает идентификатор заявлявления
   */
  get getOrderId(): number {
    // TODO: Пока заглушка с заведённым заявлением
    return 763418900;
  }

  /**
   * Собираем максимальное число файлов из всех форм
   * @private
   */
  private collectMaxFilesNumber(uploads: IFileUploadItem[]) {
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
   * Принимает новое значение от компонентов
   * @param $eventData - данные из компонента
   */
  handleNewValueSet($eventData: any) {
    if ($eventData.relatedUploads && this.value?.uploads) {
      this.value.uploads = this.value.uploads.map((value: any) => {
        if ($eventData.uploadId === value.uploadId) {
          // eslint-disable-next-line no-param-reassign
          value = { ...value, ...$eventData };
        }
        return value;
      });
    } else {
      this.value.uploads = $eventData;
    }
  }

  /**
   * Переход на следующий экран с отправкой данных
   */
  nextScreen() {
    this.nextStepEvent.emit(JSON.stringify(this.value));
  }
}
