import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActionType, ScreenButton, System } from '@epgu/epgu-constructor-types';
import {
  BusEventType,
  DeviceDetectorService,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ScreenButtonsComponent implements OnInit {
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
    public screenService: ScreenService,
  ) {}

  public ngOnInit(): void {
    this.eventBusService.on(BusEventType.GetNextStepWithoutClickedButtonEvent).subscribe(() => {
      const getNextStepButton = this.shownButtons.find(
        (button) => button.type == ActionType.nextStep,
      );
      if (getNextStepButton) this.setClickedButton(getNextStepButton);
    });
  }

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
