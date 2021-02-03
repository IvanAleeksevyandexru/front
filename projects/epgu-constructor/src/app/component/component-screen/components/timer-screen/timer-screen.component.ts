import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { TimerComponentBase } from '../../../../shared/components/timer/timer.interface';
import { ComponentActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
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
