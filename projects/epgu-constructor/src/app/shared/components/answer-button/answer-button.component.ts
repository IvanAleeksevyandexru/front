import { Component, Input } from '@angular/core';
import { ComponentDtoAction } from '../../../form-player/services/form-player-api/form-player-api.types';

interface IData extends ComponentDtoAction {
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
