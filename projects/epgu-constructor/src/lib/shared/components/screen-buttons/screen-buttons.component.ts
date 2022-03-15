import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionType, ScreenButton, ScreenTypes } from '@epgu/epgu-constructor-types';
import { BusEventType, EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenButtonService } from './screen-button.service';
import { FormArray } from '@angular/forms';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { BehaviorSubject } from 'rxjs';

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

  public clickedButton: ScreenButton;
  outputButtons$ = this.screenButtonService.outputButtons$;
  private _processingButtons = new BehaviorSubject<ScreenButton[]>(null);

  constructor(
    private eventBusService: EventBusService,
    public screenService: ScreenService,
    public screenButtonService: ScreenButtonService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  public ngOnInit(): void {
    this._processingButtons
      .pipe(
        filter((value) => !!value),
        takeUntil(this.ngUnsubscribe$),
        distinctUntilChanged((left, right) => isEqual(left, right)),
      )
      .subscribe((buttons) => this.screenButtonService.initButtonsDisablingHandling(buttons));
    this.screenButtonService.subscriptionOnInnerFormForDisablingChanges.subscribe();
    if (this.screenService.display?.type === ScreenTypes.UNIQUE) {
      this.screenButtonService.initSubscribeOnComponentsForm(new FormArray([]), {
        [this.screenService.component.id]: { isShown: true },
      });
    }

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

  public setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit(BusEventType.ScreenButtonClicked, button);
  }

  ngOnDestroy(): void {
    this.screenButtonService.clear();
  }
}
