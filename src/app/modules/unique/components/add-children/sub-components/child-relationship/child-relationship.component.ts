import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from '../../../../../questions/components/interface/question-block.interface';

@Component({
  selector: 'app-child-relationship',
  templateUrl: './child-relationship.component.html',
  styleUrls: ['./child-relationship.component.scss'],
})
export class ChildRelationshipComponent implements OnInit {
  @Input() gender: string;
  @Output() answerSelect = new EventEmitter<
    EgpuResponseQuestionsDisplayComponentAttrsActionsInterface
  >();

  answerOption: string;

  answerChoose(answer: string): void {
    const value: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface = {
      action: 'getNextAction',
      label: answer,
      value: answer,
    };
    this.answerSelect.emit(value);
  }

  ngOnInit(): void {
    this.answerOption = this.gender === 'муж' ? 'Отец' : 'Мать';
  }
}
