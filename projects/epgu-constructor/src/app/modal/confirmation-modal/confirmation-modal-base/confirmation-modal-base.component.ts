import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton, ConfirmationModal } from 'epgu-constructor-types';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { ConfirmationModalBaseButton } from './confirmation-modal-base.interface';

@Component({
  selector: 'epgu-constructor-confirmation-modal-base',
  templateUrl: './confirmation-modal-base.component.html',
  styleUrls: ['./confirmation-modal-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalBaseComponent {
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
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  closeModal(): void {
    this.eventBusService.emit(`closeModalEvent_${this.text}`);
  }
}
