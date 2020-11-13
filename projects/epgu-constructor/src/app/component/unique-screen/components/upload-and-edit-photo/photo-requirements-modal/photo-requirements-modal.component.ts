import { Component, OnInit } from '@angular/core';
import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { ConfirmationModalBaseButton } from '../../../../../modal/confirmation-modal/confirmation-modal-base/confirmation-modal-base.interface';
import { uploadPhotoElemId } from '../upload-and-edit-photo.constant';
import { PhotoRequirementsModalSetting } from './photo-requirements-modal.interface';
import { ConfigService } from '../../../../../core/config/config.service';

@Component({
  selector: 'epgu-constructor-photo-requirements-modal',
  templateUrl: './photo-requirements-modal.component.html',
  styleUrls: ['./photo-requirements-modal.component.scss'],
})
export class PhotoRequirementsModalComponent extends ModalBaseComponent implements OnInit {
  setting: PhotoRequirementsModalSetting;
  buttons: ConfirmationModalBaseButton[] = [];

  constructor(public config: ConfigService) {
    super();
  }

  ngOnInit(): void {
    this.buttons = [
      {
        label: 'Закрыть',
        handler: () => this.closeModal(),
      },
    ];
  }

  handleClickOnElemById($event: Event) {
    const targetElementId = ($event.target as HTMLElement).id;
    if (targetElementId === uploadPhotoElemId.howToTakePhoto) {
      this.modalResult.next(uploadPhotoElemId.howToTakePhoto);
      this.closeModal();
    }
  }
}
