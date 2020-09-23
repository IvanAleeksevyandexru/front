import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FileResponseToBackendUploadsItem,
  FileResponseToBackendWithRelatedUploads,
  FileUploadAttributes,
  FileUploadItem,
} from '../../../../../../shared/services/terra-byte-api/terra-byte-api.types';

@Component({
  selector: 'epgu-constructor-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  private attrs: FileUploadAttributes;
  @Input() applicantAnswers: object;
  @Input()
  set attributes(attrs: FileUploadAttributes) {
    this.attrs = attrs;
    if (attrs?.ref) {
      this.refData = this.getRefValuesForApplicantAnswers(attrs);
    }
    this.value = this.fillUploadsDefaultValue();
    this.newValueSet.emit(this.value);
  }
  get attributes(): FileUploadAttributes {
    return this.attrs;
  }
  @Input() prefixForMnemonic: string;
  @Input() objectId: number;
  @Input() isRelatedUploads = false;
  @Input() uploadId: string = null;
  refData: string = null;
  private value: FileResponseToBackendUploadsItem[] = []; // Здесь будет храниться значение на передачу
  @Output() newValueSet: EventEmitter<object> = new EventEmitter<object>();
  @Output() newRelatedValueSet: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Заполняем значения по умолчанию для возврата на сервер
   * @private
   */
  private fillUploadsDefaultValue(): FileResponseToBackendUploadsItem[] {
    const value: FileResponseToBackendUploadsItem[] = [];
    this.attrs?.uploads.forEach((upload: FileUploadItem) => {
      const newValue: FileResponseToBackendUploadsItem = {
        uploadId: upload.uploadId,
        value: [],
      };
      value.push(newValue);
    });
    return value;
  }

  /**
   * Возвращает префикс для формирования мнемоники
   * @param ref - секция ref из секции relatedUpload
   */
  getUploadComponentPrefixForMnemonic(ref: string): string {
    return [this.prefixForMnemonic, ref].join('.');
  }

  /**
   * Возвращает данные по ref параметру из applicantAnswers для формирования дополнительного заголовка
   * @param attrs - аттрибуты блока
   */
  getRefValuesForApplicantAnswers(attrs: FileUploadAttributes) {
    const sections = attrs.ref.split('.');
    const key = sections[0];
    const blockKey = sections[1];
    const value = this.applicantAnswers[key]?.value;
    if (value) {
      const refBlock = value[blockKey];

      if (refBlock) {
        const subLabel = [];
        attrs.idAttrs.forEach((id) => {
          if (refBlock[id]) {
            subLabel.push(refBlock[id]);
          }
        });
        if (subLabel.length) {
          return subLabel.join(' ');
        }
      }
    }
    return null;
  }

  /**
   * Обрабатывает новое значение от формы загрузки
   * @param $eventData - новые значения от формы
   */
  handleNewValueForItem($eventData: FileResponseToBackendUploadsItem) {
    this.value.map((valueItem: FileResponseToBackendUploadsItem) => {
      if (valueItem.uploadId === $eventData.uploadId) {
        // eslint-disable-next-line no-param-reassign
        valueItem.value = $eventData.value;
      }
      return valueItem;
    });

    if (!this.isRelatedUploads) {
      this.newValueSet.emit(this.value);
    } else {
      this.newRelatedValueSet.emit({
        uploadId: this.uploadId,
        uploads: this.value,
      } as FileResponseToBackendWithRelatedUploads);
    }
  }

  /**
   * Обрабатывает новое значение от формы загрузки по связанным документам
   * @param $eventData - новые значения от формы
   */
  handleNewRelatedValueForItem($eventData: FileResponseToBackendWithRelatedUploads) {
    this.newValueSet.emit({
      uploadId: $eventData.uploadId,
      relatedUploads: {
        uploads: $eventData.uploads,
      },
    } as FileResponseToBackendUploadsItem);
  }
}
