import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { PhotoRequirementsModalComponent } from '../photo-requirements-modal/photo-requirements-modal.component';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../../../../modal/modal.service';
import { ConfirmationModal } from '../../../../../../modal/confirmation-modal/confirmation-modal.interface';
import { uploadPhotoElemId } from '../../../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.constant';

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

  constructor(
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.setHowPhotoModalParams();
  }

  handleClickOnElemById($event: Event): void {
    const targetElementId = ($event.target as HTMLElement).id;

    if (targetElementId === uploadPhotoElemId.howToTakePhoto) {
      this.openRequirementsModal();
    }
    if (targetElementId === uploadPhotoElemId.requirements) {
      this.openHowPhotoModal();
    }
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

  setHowPhotoModalParams(): void {
    this.howPhotoModalParameters = {
      text: this.data?.attrs?.clarifications[uploadPhotoElemId.howToTakePhoto]?.text || '',
      elemEventHandlers: [
        {
          elemId: uploadPhotoElemId.requirements,
          event: 'click',
          handler(): void {
            this.modalResult.next(uploadPhotoElemId.requirements);
            this.closeModal();
          },
        },
      ],
      title: 'Как сделать фото',
    };
  }
}
