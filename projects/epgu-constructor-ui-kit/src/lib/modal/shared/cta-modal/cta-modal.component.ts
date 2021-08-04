import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-cf-ui-cta-modal',
  templateUrl: './cta-modal.component.html',
  styleUrls: ['./cta-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaModalComponent implements AfterViewInit {
  @Input() title?: ConfirmationModal['title'];
  @Input() text: ConfirmationModal['text'];
  @Input() showButtons = false;
  @Input() showCrossButton?: boolean;
  @Input() preview?: boolean;
  @Input() isShortModal?: boolean;
  @Input() isButtonsOutsideContent = false;
  @Input() scrollTop = true;

  @ViewChild('scroll', { static: false }) scroll: ElementRef;

  public isMobile: boolean;

  constructor(
    private deviceDetector: DeviceDetectorService,
    private eventBusService: EventBusService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngAfterViewInit(): void {
    if (this.scroll && this.scrollTop) {
      /* TODO Подумать над лучшей реализацией. Сейчас задержка необходима для корректной работы
      https://jira.egovdev.ru/secure/attachment/514868/514868_2021-07-06+12-03-52.mp4
      */
      setTimeout(() => {
        this.scroll.nativeElement.scrollIntoView();
      });
    }
  }

  closeModal(): void {
    this.eventBusService.emit(`closeModalEvent_${this.text}`);
  }
}
