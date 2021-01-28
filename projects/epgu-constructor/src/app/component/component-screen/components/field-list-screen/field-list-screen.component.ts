import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-field-list-screen',
  templateUrl: './field-list-screen.component.html',
  providers: [UnsubscribeService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldListScreenComponent {
  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}
}
