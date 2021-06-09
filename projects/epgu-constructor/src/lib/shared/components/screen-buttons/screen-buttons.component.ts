import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenButtonsComponent {
  @Input() screenButtons: Array<ScreenButton>;
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;

  constructor(private eventBusService: EventBusService) {}

  setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit('screenButtonClicked', button);
  }
}
