import { Component, Input } from '@angular/core';
import { QuestionsComponentActions } from '../../../screen/questions-screen/questions-screen.types';

interface IData extends QuestionsComponentActions {
  hint: string;
}
@Component({
  selector: 'epgu-constructor-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.scss'],
})
export class AnswerButtonComponent {
  @Input() data: Partial<IData>;
}
