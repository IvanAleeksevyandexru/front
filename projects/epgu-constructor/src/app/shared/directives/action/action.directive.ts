import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { ComponentActionDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ActionService } from './action.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective implements OnInit{
  @Input() action: ComponentActionDto;
  @Input() componentId: string;

  constructor(
    private readonly actionService: ActionService,
  ) {}

  @HostListener('click') onClick(): void {
    this.actionService.switchAction();
  }

  ngOnInit(): void {
    this.actionService.action = this.action;
    this.actionService.componentId = this.componentId;
  }
}
