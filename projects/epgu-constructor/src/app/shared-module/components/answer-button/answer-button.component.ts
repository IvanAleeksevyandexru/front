import { Component, Input } from '@angular/core';
import { QuestionsComponentActionsInterface } from '../../../modules/questions/components/interface/question-block.interface';

interface IData extends QuestionsComponentActionsInterface {
  hint: string;
}
@Component({
  selector: 'epgu-constructor-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss'],
})
export class AnswerButtonComponent {
  @Input()
  data: Partial<IData>;
}
