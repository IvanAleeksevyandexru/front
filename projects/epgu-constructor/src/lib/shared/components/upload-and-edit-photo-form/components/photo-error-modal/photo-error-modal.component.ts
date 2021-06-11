import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';

import { ModalBaseComponent, ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { ImageErrorText } from '../../upload-and-edit-photo-form.model';
import { imageErrorText } from '../../upload-and-edit-photo-form.constant';

@Component({
  selector: 'epgu-constructor-photo-error-modal',
  templateUrl: './photo-error-modal.component.html',
  styleUrls: ['./photo-error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoErrorModalComponent extends ModalBaseComponent {
  imageErrorText: ImageErrorText = imageErrorText;
  imageErrors: string[][];

  constructor(public config: ConfigService, public injector: Injector) {
    super(injector);
  }

  choseAnotherPhoto(): void {
    this.modalResult.next({ changeImage: true });
    this.closeModal();
  }
}