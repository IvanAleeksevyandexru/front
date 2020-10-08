import { Directive, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActionType,
  ComponentDtoAction,
} from '../../../services/api/form-player-api/form-player-api.types';
import { ActionApiService } from '../../../services/api/action-api/action-api.service';
import { ScreenService } from '../../../screen/screen.service';
import { Navigation, NavigationOptions } from '../../../form-player.types';
import { NavigationService } from '../../services/navigation/navigation.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Answer } from '../../types/answer';
import { ConfigService } from '../../../config/config.service';

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
    private navigationService: NavigationService,
    private utilsService: UtilsService,
    private configService: ConfigService,
  ) {}

  private switchAction(): void {
    switch (this.action.type) {
      case ActionType.download:
        this.downloadAction();
        break;
      case ActionType.nextStep:
        this.nextStep();
        break;
      case ActionType.redirectToLK:
        this.redirectToLK();
        break;
    }
  }

  private sendAction<T>(responseType?: 'blob'): Observable<T | Blob> {
    return this.actionApiService.send<T>(
      this.action.action,
      this.screenService.getStore(),
      responseType,
    );
  }

  private nextStep(): void {
    const options = this.getOptions();

    const navigation: Navigation = {
      payload: this.getComponentStateForNavigate(),
      options,
    };

    this.navigationService.nextStep.next(navigation);
  }

  private getOptions(): NavigationOptions {
    return this.action.action.includes('service') ? { url: this.action.action } : {};
  }

  private getComponentStateForNavigate(): {
    [key: string]: Answer;
  } {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: this.action.value,
      },
    };
  }

  private downloadAction(): void {
    this.sendAction<Blob>('blob').subscribe(
      (value) => {
        this.utilsService.downloadFile(value);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private redirectToLK(): void {
    window.location.href = `${this.configService.lkUrl}/profile/personal`;
  }
}
