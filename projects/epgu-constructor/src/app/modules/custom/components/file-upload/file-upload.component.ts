import { Component, Input } from '@angular/core';
import { IFileUploadAttributes } from '../file-upload-item/data';
import { ConstructorService } from '../../../../services/constructor/constructor.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  private attrs: IFileUploadAttributes;
  @Input() set attributes(attrs: IFileUploadAttributes) {
    this.attrs = attrs;
    if (attrs?.ref) {
      this.refData = this.getRefValuesForApplicantAnswers(attrs);
    }
  }
  get attributes(): IFileUploadAttributes {
    return this.attrs;
  }
  @Input() prefixForMnemonic: string;
  @Input() objectId: number;
  refData: string = null;

  constructor(private constructorService: ConstructorService) {}

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
  getRefValuesForApplicantAnswers(attrs: IFileUploadAttributes) {
    const { response } = this.constructorService;
    const sections = attrs.ref.split('.');
    const key = sections[0];
    const blockKey = sections[1];
    const value = response?.applicantAnswers[key]?.value;
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
}
