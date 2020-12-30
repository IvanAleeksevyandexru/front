import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { imageErrorText } from '../upload-and-edit-photo.constant';
import { ImageErrorText } from '../upload-and-edit-photo.model';
import { ConfigService } from '../../../../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-photo-error-modal',
  templateUrl: './photo-error-modal.component.html',
  styleUrls: ['./photo-error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoErrorModalComponent extends ModalBaseComponent {
  imageErrorText: ImageErrorText = imageErrorText;
  imageErrors: string[][];

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(public config: ConfigService) {
    super();
  }

  choseAnotherPhoto(): void {
    this.modalResult.next({ changeImage: true });
    this.closeModal();
  }
}
