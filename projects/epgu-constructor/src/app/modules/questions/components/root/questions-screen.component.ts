import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import {
  EgpuResponseQuestionsDisplayComponentAttrsActionsInterface,
  EgpuResponseQuestionsDisplayInterface,
} from '../interface/question-block.interface';

@Component({
  selector: 'app-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent {
  @Input() data: EgpuResponseQuestionsDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(private navService: NavigationService, private ngUnsubscribe$: UnsubscribeService) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.goPrevStepEvent());
  }

  goPrevStepEvent() {
    this.prevStepEvent.emit();
  }

  answerChoose(answer: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface): void {
    this.nextStepEvent.emit(answer.value);
  }
}
