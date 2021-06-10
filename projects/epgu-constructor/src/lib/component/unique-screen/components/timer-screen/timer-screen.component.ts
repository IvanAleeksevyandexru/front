import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentActionDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { TimerComponentBase } from '../../../../shared/components/timer/timer.interface';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-timer-screen',
  templateUrl: './timer-screen.component.html',
  providers: [UnsubscribeService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerScreenComponent {
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  data$: Observable<TimerComponentBase> = this.screenService.component$ as Observable<
    TimerComponentBase
  >;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}
}
