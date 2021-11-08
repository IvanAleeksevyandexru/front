import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { NEXT_STEP_ACTION } from '../../../../../../../shared/constants/actions';
import { EVENT_TIMESLOT_BOOK, EVENT_TIMESLOT_BOOK_RESULT } from '../../../typings';
import { ActionService } from '../../../../../../../shared/directives/action/action.service';

@Component({
  selector: 'epgu-constructor-time-slot-button',
  templateUrl: './time-slot-button.component.html',
  styleUrls: ['./time-slot-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class TimeSlotButtonComponent implements OnInit {
  @Input() id = '';

  button$ = this.screenService.button$;
  disabled$ = combineLatest([
    this.currentAnswers.isValid$,
    this.state.progress$,
    this.state.slot$,
  ]).pipe(map(([isValid, loading, selectedSlot]) => !isValid || loading || !selectedSlot?.slotId));
  isLoading$: Observable<boolean> = this.screenService.isLoading$;

  nextStepAction = NEXT_STEP_ACTION;
  componentId = this.screenService.component.id;

  additionalDisplayingButton$ = this.state.additionalDisplayingButton$;

  constructor(
    private screenService: ScreenService,
    private currentAnswers: CurrentAnswersService,
    private state: TimeSlotStateService,
    private eventBus: EventBusService,
    private actionService: ActionService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  bookAction(): void {
    this.eventBus.emit(EVENT_TIMESLOT_BOOK, this.id);
  }

  nextAction(): void {
    this.actionService.switchAction(this.nextStepAction, this.componentId);
  }

  ngOnInit(): void {
    this.eventBus
      .on(`${this.id}${EVENT_TIMESLOT_BOOK_RESULT}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.nextAction());
  }
}
