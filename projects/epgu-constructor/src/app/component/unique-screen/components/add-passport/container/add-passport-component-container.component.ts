import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../screen/screen.types';
import { Passport } from '../add-passport.models';
import { ComponentActionDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-add-passport-container',
  templateUrl: './add-passport-component-container.component.html',
  styleUrls: ['./add-passport-component-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPassportContainerComponent {
  data$: Observable<ComponentBase> = this.screenService.component$;

  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}

  onPassportDataChange({ value, isValid }: Passport): void {
    this.currentAnswersService.isValid = isValid;
    this.currentAnswersService.state = JSON.stringify(value);
  }
}
