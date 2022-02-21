import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActionType, ScreenButton } from '@epgu/epgu-constructor-types';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenButtonService } from './screen-button.service';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ScreenButtonsComponent implements OnInit {
  @Input() set screenButtons(screenButtons: ScreenButton[]) {
    this.screenButtonService.initButtonsDisablingHandling(screenButtons);
  }
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;

  constructor(
    private eventBusService: EventBusService,
    public screenService: ScreenService,
    public screenButtonService: ScreenButtonService,
  ) {}

  public ngOnInit(): void {
    this.eventBusService.on(BusEventType.GetNextStepWithoutClickedButtonEvent).subscribe(() => {
      const getNextStepButton = this.screenButtonService.outputButtons.find(
        (button) => button.type == ActionType.nextStep,
      );
      if (getNextStepButton) this.setClickedButton(getNextStepButton);
    });
  }

  public setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit(BusEventType.ScreenButtonClicked, button);
  }
}
