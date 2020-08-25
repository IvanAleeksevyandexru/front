import { Component, Input } from '@angular/core';
import { QuestionsComponentActionsInterface } from '../interface/question-block.interface';

export interface IData extends QuestionsComponentActionsInterface {
  hint: string;
}
@Component({
  selector: 'epgu-constructor-answer-choice',
  templateUrl: './answer-choice.component.html',
  styleUrls: ['./answer-choice.component.scss'],
})
export class AnswerChoiceComponent {
  @Input() data: Partial<IData>;
}
