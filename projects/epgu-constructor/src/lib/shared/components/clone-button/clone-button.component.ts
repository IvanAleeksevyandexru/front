import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-constructor-clone-button',
  templateUrl: './clone-button.component.html',
  styleUrls: ['./clone-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloneButtonComponent {
  @Input() disabled?: boolean;

  constructor(private eventBusService: EventBusService) {}

  onClick(): void {
    this.eventBusService.emit('cloneButtonClickEvent');
  }
}
