import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton, System } from '@epgu/epgu-constructor-types';
import {
  BusEventType,
  DeviceDetectorService,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ScreenButtonsComponent {
  @Input() set screenButtons(screenButtons: ScreenButton[]) {
    this.shownButtons = this.getShownButtons(screenButtons);
  }
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;
  public shownButtons: ScreenButton[];
  private readonly clientSystem: System = this.deviceDetectorService.system;

  constructor(
    private eventBusService: EventBusService,
    private deviceDetectorService: DeviceDetectorService,
  ) {}

  public setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit(BusEventType.ScreenButtonClicked, button);
  }

  private getShownButtons(buttons: ScreenButton[]): ScreenButton[] {
    return buttons.filter((screenButton) => {
      const showOnOS = screenButton.attrs?.showOnOS;
      return !showOnOS || showOnOS.includes(this.clientSystem);
    });
  }
}
