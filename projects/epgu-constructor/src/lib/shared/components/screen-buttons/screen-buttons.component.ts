import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenButtonsComponent implements OnInit {
  @Input() screenButtons: ScreenButton[];
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;
  public shownButtons: ScreenButton[];
  private clientSystem: System;

  constructor(
    private eventBusService: EventBusService,
    private deviceDetectorService: DeviceDetectorService,
  ) {}

  public ngOnInit(): void {
    this.clientSystem = this.deviceDetectorService.system;

    this.shownButtons = this.screenButtons.filter((screenButton) => {
      const showOnOS = screenButton.attrs?.showOnOS;

      return !showOnOS || showOnOS.includes(this.clientSystem);
    });
  }

  public setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit(BusEventType.ScreenButtonClicked, button);
  }
}
