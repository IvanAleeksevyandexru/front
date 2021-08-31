import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ComponentDto, ConfirmationModal } from '@epgu/epgu-constructor-types';
import { ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { PhotoRequirementsModalComponent } from '../photo-requirements-modal/photo-requirements-modal.component';
import { uploadPhotoElemId } from '../../../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.constant';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-photo-description',
  templateUrl: './photo-description.component.html',
  styleUrls: ['./photo-description.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDescriptionComponent implements OnInit {
  @Input() data: ComponentDto;
  howPhotoModalParameters: ConfirmationModal;
  whyNeedPhotoModalParameters: ConfirmationModal;

  constructor(
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.howPhotoModalParameters = this.setModalParams(
      uploadPhotoElemId.howToTakePhoto,
      uploadPhotoElemId.requirements,
    );
    this.whyNeedPhotoModalParameters = this.setModalParams(
      uploadPhotoElemId.whyneedphoto,
      uploadPhotoElemId.requirements,
    );
  }

  handleClickOnElemById($event: Event): void {
    const targetElementId = ($event.target as HTMLElement).id;

    if (targetElementId === uploadPhotoElemId.howToTakePhoto) {
      this.openRequirementsModal();
    }
    if (targetElementId === uploadPhotoElemId.requirements) {
      this.openHowPhotoModal();
    }
    if (targetElementId === uploadPhotoElemId.whyneedphoto) {
      this.openWhyNeedPhoto();
    }
  }

  openWhyNeedPhoto(): void {
    this.modalService
      .openModal(ConfirmationModalComponent, this.whyNeedPhotoModalParameters)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        if (value === uploadPhotoElemId.requirements) {
          this.openRequirementsModal();
        }
        this.cdr.markForCheck();
      });
  }

  openRequirementsModal(): void {
    const { setting = {} } = this.data?.attrs?.clarifications[uploadPhotoElemId.requirements];
    this.modalService
      .openModal(PhotoRequirementsModalComponent, { setting })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        if (value === uploadPhotoElemId.howToTakePhoto) {
          this.openHowPhotoModal();
        }
        this.cdr.markForCheck();
      });
  }

  openHowPhotoModal(): void {
    this.modalService
      .openModal(ConfirmationModalComponent, this.howPhotoModalParameters)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        if (value === uploadPhotoElemId.requirements) {
          this.openRequirementsModal();
        }
        this.cdr.markForCheck();
      });
  }

  setModalParams(
    clarificationId: uploadPhotoElemId,
    nextModal: uploadPhotoElemId,
  ): ConfirmationModal {
    return {
      text: this.data?.attrs?.clarifications[clarificationId]?.text || '',
      title: this.data?.attrs?.clarifications[clarificationId]?.title || '',
      elemEventHandlers: [
        {
          elemId: nextModal,
          event: 'click',
          handler(): void {
            this.modalResult.next(nextModal);
            this.closeModal();
          },
        },
      ],
    };
  }
}
