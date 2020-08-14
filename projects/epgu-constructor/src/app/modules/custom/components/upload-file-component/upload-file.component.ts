import { Component, Input } from '@angular/core';
import { EgpuResponseComponentInterface } from '../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent {
  @Input() attributes: EgpuResponseComponentInterface;
  @Input() objectId: number; // Идентификато объекта
  @Input() prefixForMnemonic: string; // Префикс для создания мнемоники
}
