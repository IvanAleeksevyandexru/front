import { Directive, HostListener, Input } from '@angular/core';
import { ComponentActionDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ActionService } from './action.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentActionDto;
  @Input() componentId: string;

  constructor(
    private readonly actionService: ActionService,
  ) {}

  @HostListener('click') onClick(): void {
    this.actionService.action = this.action;
    this.actionService.componentId = this.componentId;
    this.actionService.switchAction();
  }
}
