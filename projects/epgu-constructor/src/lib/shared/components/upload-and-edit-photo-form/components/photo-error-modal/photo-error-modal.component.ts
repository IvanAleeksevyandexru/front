import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';

import { ModalBaseComponent, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ImageErrorText } from '../../upload-and-edit-photo-form.model';
import { imageErrorText } from '../../upload-and-edit-photo-form.constant';
const imageErrorPicture = require('!raw-loader!projects/epgu-constructor-ui-kit/src/assets/icons/svg/image-error.svg')
  .default as string;
@Component({
  selector: 'epgu-constructor-photo-error-modal',
  templateUrl: './photo-error-modal.component.html',
  styleUrls: ['./photo-error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoErrorModalComponent extends ModalBaseComponent implements OnInit {
  imageErrorText: ImageErrorText;
  customImageErrorText: ImageErrorText;
  imageErrors: string[][];
  imageErrorPicture = imageErrorPicture;

  constructor(public config: ConfigService, public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.setCustomErrorText();
  }

  choseAnotherPhoto(): void {
    this.modalResult.next({ changeImage: true });
    this.closeModal();
  }

  private setCustomErrorText(): void {
    this.imageErrorText = {
      ...imageErrorText,
      ...this.customImageErrorText,
    };
  }
}
