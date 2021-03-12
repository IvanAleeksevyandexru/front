import { Directive, HostListener, Input } from '@angular/core';
import {
  ActionType,
  ComponentActionDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ActionService } from './action.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentActionDto;
  @Input() componentId: string;

  constructor(
    private readonly actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLButtonElement;
    if (
      event.key === 'Enter' &&
      this.action.type === ActionType.nextStep &&
      !target.classList.contains('multiline-input') &&
      target?.name !== 'prev'
    ) {
      event.preventDefault();
      this.currentAnswersService.isValid &&
        this.actionService.switchAction(this.action, this.componentId);
    }
  }

  @HostListener('click') onClick(): void {
    this.actionService.switchAction(this.action, this.componentId);
  }
}
