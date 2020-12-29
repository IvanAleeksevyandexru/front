import { Component, Input } from '@angular/core';
import { EventBusService } from '../../../form-player/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-constructor-clone-button',
  templateUrl: './clone-button.component.html',
  styleUrls: ['./clone-button.component.scss'],
})
export class CloneButtonComponent {
  @Input() disabled?: boolean;

  constructor(private eventBusService: EventBusService) {}

  onClick(): void {
    this.eventBusService.emit('cloneButtonClickEvent');
  }
}
