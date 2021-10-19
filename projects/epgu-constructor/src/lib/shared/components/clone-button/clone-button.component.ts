import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';

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
    this.eventBusService.emit(BusEventType.CloneButtonClickEvent);
  }
}
