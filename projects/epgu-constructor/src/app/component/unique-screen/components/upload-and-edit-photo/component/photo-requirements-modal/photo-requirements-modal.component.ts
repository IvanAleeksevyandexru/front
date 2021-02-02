import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ConfigService } from '../../../../../../core/services/config/config.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmationModalBaseButton } from '../../../../../../modal/confirmation-modal/confirmation-modal-base/confirmation-modal-base.interface';
import { ModalBaseComponent } from '../../../../../../modal/shared/modal-base/modal-base.component';
import { uploadPhotoElemId } from '../../upload-and-edit-photo.constant';
import { PhotoRequirementsModalSetting } from './photo-requirements-modal.interface';

@Component({
  selector: 'epgu-constructor-photo-requirements-modal',
  templateUrl: './photo-requirements-modal.component.html',
  styleUrls: ['./photo-requirements-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoRequirementsModalComponent extends ModalBaseComponent implements OnInit {
  setting: PhotoRequirementsModalSetting;
  buttons: ConfirmationModalBaseButton[] = [];
  validIconPath = `${this.config.staticDomainAssetsPath}/assets/icons/svg/icon-valid.svg`;
  invalidIconPath = `${this.config.staticDomainAssetsPath}/assets/icons/svg/icon-invalid.svg`;

  constructor(
    public injector: Injector,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.buttons = [
      {
        label: 'Закрыть',
        handler: (): void => this.closeModal(),
      },
    ];

    this.eventBusService
      .on('closeModalEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
        this.cdr.markForCheck();
      });
  }

  handleClickOnElemById($event: Event): void {
    const targetElementId = ($event.target as HTMLElement).id;
    if (targetElementId === uploadPhotoElemId.howToTakePhoto) {
      this.modalResult.next(uploadPhotoElemId.howToTakePhoto);
      this.closeModal();
    }
  }
}
