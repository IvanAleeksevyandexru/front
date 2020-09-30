import { Directive, HostListener, Input } from '@angular/core';
import {
  ActionType,
  ComponentDtoAction,
} from '../../../services/api/form-player-api/form-player-api.types';
import { ActionApiService } from '../../../services/api/action-api/action-api.service';
import { ScreenService } from '../../../screen/screen.service';
import { Navigation } from '../../../form-player.types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Directive({
  selector: '[epgu-constructor-action]',
})
export class ActionDirective {
  @Input() action: ComponentDtoAction;

  @HostListener('click') onClick() {
    this.switchAction();
  }

  constructor(
    private actionApiService: ActionApiService,
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private navigationService: NavigationService,
    private utilsService: UtilsService,
  ) {}

  private switchAction() {
    switch (this.action.type) {
      case ActionType.download:
        this.downloadAction();
        break;
      case ActionType.nextStep:
        this.nextStep();
        break;
    }
  }

  private sendAction<T>() {
    return this.actionApiService.send<T>(this.action.action, this.screenService.getStore());
  }

  private nextStep() {
    const navigation: Navigation = {
      payload: this.getComponentStateForNavigate(),
      options: { url: this.action.action },
    };

    this.navigationService.nextStep.next(navigation);
  }

  private getComponentStateForNavigate() {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: this.currentAnswersService.state,
      },
    };
  }

  private downloadAction() {
    this.sendAction<{ value: string }>().subscribe((value) =>
      this.utilsService.downloadCalendar(value.value as any),
    );
  }
}
