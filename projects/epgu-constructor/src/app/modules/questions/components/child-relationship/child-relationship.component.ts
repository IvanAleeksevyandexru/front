import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionsComponentActionsInterface } from '../../../../../interfaces/question-block.interface';

@Component({
  selector: 'epgu-constructor-child-relationship',
  templateUrl: './child-relationship.component.html',
  styleUrls: ['./child-relationship.component.scss'],
})
export class ChildRelationshipComponent implements OnInit {
  @Input() gender: string;
  @Output() answerSelect = new EventEmitter<QuestionsComponentActionsInterface>();

  answerOption: string;

  answerChoose(answer: string): void {
    const value: QuestionsComponentActionsInterface = {
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
