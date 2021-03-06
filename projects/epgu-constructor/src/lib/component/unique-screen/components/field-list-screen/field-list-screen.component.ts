import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentActionDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
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
