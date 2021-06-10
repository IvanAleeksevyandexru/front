import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-cf-ui-cta-modal',
  templateUrl: './cta-modal.component.html',
  styleUrls: ['./cta-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaModalComponent {
  @Input() title?: ConfirmationModal['title'];
  @Input() text: ConfirmationModal['text'];
  @Input() showButtons = false;
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
