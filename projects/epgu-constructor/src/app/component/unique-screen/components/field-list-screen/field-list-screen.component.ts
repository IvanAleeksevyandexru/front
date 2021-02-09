import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-field-list-screen',
  templateUrl: './field-list-screen.component.html',
  providers: [UnsubscribeService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldListScreenComponent {
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}
}
