import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EgpuResponseQuestionsDisplayComponentAttrsActionsInterface,
  EgpuResponseQuestionsDisplayInterface,
} from '../interface/question-block.interface';

@Component({
  selector: 'app-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
})
export class QuestionsScreenComponent implements OnInit {
  @Input() data: EgpuResponseQuestionsDisplayInterface;
  @Output() answerSelect = new EventEmitter<
    EgpuResponseQuestionsDisplayComponentAttrsActionsInterface
  >();

  ngOnInit(): void {}

  answerChoose(answer: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface): void {
    this.answerSelect.emit(answer);
  }
}
