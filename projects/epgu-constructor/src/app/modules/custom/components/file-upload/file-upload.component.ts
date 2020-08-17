import { Component, Input } from '@angular/core';
import { IFileUploadAttributes } from '../file-upload-item/data';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() attributes: IFileUploadAttributes;
  @Input() prefixForMnemonic: string;
  @Input() objectId: number;

  /**
   * Возвращает префикс для формирования мнемоники
   * @param ref - секция ref из секции relatedUpload
   */
  getUploadComponentPrefixForMnemonic(ref: string): string {
    return [this.prefixForMnemonic, ref].join('.');
  }
}
