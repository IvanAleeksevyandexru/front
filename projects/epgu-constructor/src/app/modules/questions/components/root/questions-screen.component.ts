import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  EgpuResponseQuestionsDisplayComponentAttrsActionsInterface,
  EgpuResponseQuestionsDisplayInterface,
} from '../interface/question-block.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';

@Component({
  selector: 'app-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
})
export class QuestionsScreenComponent implements OnInit, OnDestroy {
  ngUnsubscribe$ = new Subject();

  @Input() data: EgpuResponseQuestionsDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(private navService: NavigationService) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.goPrevStepEvent());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goPrevStepEvent() {
    this.prevStepEvent.emit();
  }

  answerChoose(answer: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface): void {
    this.nextStepEvent.emit(answer.value);
  }
}
