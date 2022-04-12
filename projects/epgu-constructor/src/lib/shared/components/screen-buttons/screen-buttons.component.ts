import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionType, ScreenButton } from '@epgu/epgu-constructor-types';
import { BusEventType, EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { FormArray } from '@angular/forms';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenButtonService } from './screen-button.service';
import { CustomListStatusElements } from '../../../component/custom-screen/components-list.types';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [UnsubscribeService, ScreenButtonService],
})
export class ScreenButtonsComponent implements OnInit, OnDestroy {
  @Input() set screenButtons(screenButtons: ScreenButton[]) {
    this._processingButtons.next(screenButtons);
  }
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;
  @Input() customScreenForm?: FormArray;
  @Input() customScreenElements?: CustomListStatusElements;

  public clickedButton: ScreenButton;
  outputButtons$ = this.screenButtonService.outputButtons$;
  private _processingButtons = new BehaviorSubject<ScreenButton[]>(null);

  constructor(
    private eventBusService: EventBusService,
    public screenService: ScreenService,
    public screenButtonService: ScreenButtonService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this._processingButtons
      .pipe(
        filter((value) => !!value),
        takeUntil(this.ngUnsubscribe$),
        distinctUntilChanged((left, right) => isEqual(left, right)),
      )
      .subscribe((buttons) => this.screenButtonService.initButtonsDisablingHandling(buttons));

    this.screenButtonService.subscriptionOnInnerFormForDisablingChanges.subscribe();

    this.screenButtonService.initSubscribeOnComponentsForm(
      this.customScreenForm ? this.customScreenForm : new FormArray([]),
      this.customScreenElements
        ? this.customScreenElements
        : {
            [this.screenService.component?.id]: { isShown: true },
          },
    );

    this.eventBusService
      .on(BusEventType.GetNextStepWithoutClickedButtonEvent)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        const getNextStepButton = this.screenButtonService.outputButtons.find(
          (button) => button.type == ActionType.nextStep,
        );
        if (getNextStepButton) this.setClickedButton(getNextStepButton);
      });
  }

  setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit(BusEventType.ScreenButtonClicked, button);
  }

  ngOnDestroy(): void {
    this.screenButtonService.clear();
  }
}
