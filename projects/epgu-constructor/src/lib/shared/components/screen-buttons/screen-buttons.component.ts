import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenButtonsComponent {
  @Input() screenButtons: ScreenButton[];
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;

  constructor(private eventBusService: EventBusService) {}

  setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit(BusEventType.ScreenButtonClicked, button);
  }
}
