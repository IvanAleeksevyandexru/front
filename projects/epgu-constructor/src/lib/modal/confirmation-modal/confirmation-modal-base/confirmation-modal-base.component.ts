import { OnInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ScreenButton, ConfirmationModal, ActionType } from '@epgu/epgu-constructor-types';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmationModalBaseButton } from './confirmation-modal-base.interface';

@Component({
  selector: 'epgu-constructor-confirmation-modal-base',
  templateUrl: './confirmation-modal-base.component.html',
  styleUrls: ['./confirmation-modal-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalBaseComponent implements OnInit {
  @Input() title?: ConfirmationModal['title'];
  @Input() text: ConfirmationModal['text'];
  @Input() buttons: ConfirmationModalBaseButton[] = [];
  @Input() actionButtons: ScreenButton[] = [];
  @Input() showCrossButton?: boolean;
  @Input() preview?: boolean;
  @Input() isShortModal?: boolean;
  @Input() isButtonsOutsideContent? = false;

  public isMobile: boolean;
  public scrollConfig = { suppressScrollX: true, wheelPropagation: false };

  constructor(
    private deviceDetector: DeviceDetectorService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngOnInit(): void {
    this.eventBusService
      .on('screenButtonClicked')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((button: ScreenButton) => {
        if (button.type === ActionType.deliriumNextStep) {
          this.closeModal();
        }
      });
  }

  closeModal(): void {
    this.eventBusService.emit(`closeModalEvent_${this.text}`);
  }
}
