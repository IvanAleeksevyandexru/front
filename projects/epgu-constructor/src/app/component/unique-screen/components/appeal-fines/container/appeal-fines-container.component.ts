import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppealFinesComponentAttrs } from '../appeal-fines.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { CustomScreenComponentTypes } from '../../../../../shared/components/components-list/components-list.types';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
} from '../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-appeal-fines-container',
  templateUrl: 'appeal-fines-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppealFinesContainerComponent {
  isLoading$ = this.screenService.isLoading$;
  submitLabel$ = this.screenService.submitLabel$;
  isValid$ = this.currentAnswersService.isValid$;
  components$ = this.screenService.component$.pipe(
    map(({ attrs }) => (attrs as AppealFinesComponentAttrs).components),
  );

  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };

  readonly customComponentTypes = CustomScreenComponentTypes;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
  ) {}

  public updateCurrentAnswers($event: { isValid: boolean; state: string }): void {
    this.currentAnswersService.isValid = $event.isValid;
    this.currentAnswersService.state = JSON.stringify($event.state);
  }
}
