import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { Subscription } from 'rxjs';
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
  subscriptions: Array<Subscription> = [];

  @Input() data: EgpuResponseQuestionsDisplayInterface;
  @Output() answerSelect = new EventEmitter<
    EgpuResponseQuestionsDisplayComponentAttrsActionsInterface
  >();
  @Output() prevStepEvent = new EventEmitter();

  constructor(private navService: NavigationService) {
    this.subscriptions.push(this.navService.clickToBack$.subscribe(() => this.goPrevStepEvent()));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  goPrevStepEvent() {
    this.prevStepEvent.emit();
  }

  answerChoose(answer: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface): void {
    this.answerSelect.emit(answer);
  }
}
