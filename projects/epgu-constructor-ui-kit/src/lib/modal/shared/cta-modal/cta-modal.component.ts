import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
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

  @ViewChild('perfectScroll', { static: false, read: ElementRef }) perfectScroll: ElementRef<
    PerfectScrollbarComponent
  >;

  public isMobile: boolean;
  public scrollConfig: PerfectScrollbarConfigInterface = { suppressScrollX: true };

  constructor(
    private deviceDetector: DeviceDetectorService,
    private eventBusService: EventBusService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngAfterViewInit(): void {
    if (this.perfectScroll && this.scrollTop) {
      window.requestAnimationFrame(() => {
        (this.perfectScroll as ElementRef).nativeElement.scrollIntoView();
      });
    }
  }

  closeModal(): void {
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService.emit(`closeModalEvent_${this.text}`);
  }
}
