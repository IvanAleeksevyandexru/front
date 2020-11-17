import { Component, Injector, OnInit } from '@angular/core';
import { NavigationPayload } from '../../form-player/form-player.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { QuestionsComponentActions } from './questions-screen.types';
import { ScreenClass } from '../screen.class';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent extends ScreenClass {
  constructor(public injector: Injector) {
    super(injector);
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
}
