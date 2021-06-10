import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import {
  ModalBaseComponent,
  EventBusService,
  UnsubscribeService,
  ConfigService,
  ConfirmationModalBaseButton,
} from '@epgu/epgu-constructor-ui-kit';

import { PhotoRequirementsModalSetting } from './photo-requirements-modal.interface';
import { uploadPhotoElemId } from '../../../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.constant';

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
  modalName = 'photoRequirementsModal';
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
      .on(`closeModalEvent_${this.modalName}`)
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
