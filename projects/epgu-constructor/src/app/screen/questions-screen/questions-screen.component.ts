import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { DeviceDetectorService } from '../../shared/services/device-detector/device-detector.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { Screen } from '../screen.types';
import { QuestionsComponentActions } from './questions-screen.types';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent implements OnInit, Screen {
  constructor(
    private deviceDetector: DeviceDetectorService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    if (this.deviceDetector.isMobile) {
      this.calculateHeight();
      fromEvent(window, 'scroll')
        .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(300))
        .subscribe(() => this.calculateHeight());
    }

    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  answerChoose(answer: QuestionsComponentActions): void {
    if (answer.disabled) {
      return;
    }
    const data: NavigationPayload = {};

    const componentId = this.screenService.component.id;
    data[componentId] = {
      visited: true,
      value: answer.value || '',
    };

    this.nextStep(data);
  }

  calculateHeight(): void {
    const menuHeight = 88;
    const buttonMarginBottom = 20;
    const componentHeight: number = window.innerHeight - menuHeight - buttonMarginBottom;
    this.renderer.setStyle(this.elRef.nativeElement, 'min-height', `${componentHeight}px`);
  }
}
