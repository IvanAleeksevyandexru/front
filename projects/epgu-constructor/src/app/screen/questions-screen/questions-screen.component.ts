import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { HelperService } from 'epgu-lib';
import { fromEvent } from 'rxjs';
import { NavigationPayload } from '../../form-player.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
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
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) {
    if (HelperService.isMobile()) {
      fromEvent(window, 'scroll')
        .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(300))
        .subscribe(() => this.calculateHeight());
    }
  }

  ngOnInit(): void {
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
    const componentHeight: number = window.innerHeight - menuHeight;
    this.renderer.setStyle(this.elRef.nativeElement, 'min-height', `${componentHeight}px`);
  }
}
