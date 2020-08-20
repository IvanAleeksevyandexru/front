import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { EgpuResponseComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { IFileUploadItem } from './sub-components/file-upload-item/data';

@Component({
  selector: 'app-file-upload-screen',
  templateUrl: './file-upload-screen.component.html',
  styleUrls: ['./file-upload-screen.component.scss'],
})
export class FileUploadScreenComponent {
  private head: string;
  @Input() set header(header: string) {
    this.head = header;
  }
  get header() {
    return this.head ? this.head : this.data.label;
  }
  private info: EgpuResponseComponentInterface;
  @Input() set data(data: EgpuResponseComponentInterface) {
    this.info = data;
    this.allMaxFiles = 0;
    const { attrs } = data;
    // @ts-ignore
    const { uploads } = attrs;
    this.collectMaxFilesNumber(uploads);
  }
  get data(): EgpuResponseComponentInterface {
    return this.info;
  }
  @Input() submitLabel: string;
  @Output() nextStepEvent = new EventEmitter();

  allMaxFiles = 0;

  constructor(public constructorService: ConstructorService) {}

  /**
   * Возвращает префикс для формирования мнемоники
   * @param componentData - данные компонента
   */
  getUploadComponentPrefixForMnemonic(componentData: EgpuResponseComponentInterface): string {
    return [componentData.id, 'FileUploadComponent'].join('.');
  }

  /**
   * Возвращает идентификатор заявлявления
   */
  get getOrderId(): number {
    // TODO: Пока заглушка с заведённым заявлением
    return 763418900;

    // return Number(this.constructorService.response.orderId);
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

  nextScreen() {
    this.nextStepEvent.emit(JSON.stringify({}));
  }
}
