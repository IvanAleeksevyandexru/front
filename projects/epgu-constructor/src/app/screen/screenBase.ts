import { Injector } from '@angular/core';
import { EventBusService } from '../core/services/event-bus/event-bus.service';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../form-player/form-player.types';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenService } from './screen.service';

// Желательно больше не наследоваться потому что это может усложнить логику.
export abstract class ScreenBase{
  public navigationService: NavigationService;
  public ngUnsubscribe$: UnsubscribeService;
  public screenService: ScreenService;
  public currentAnswersService: CurrentAnswersService;
  public eventBusService: EventBusService;

  protected constructor(public injector: Injector) {
    this.navigationService = this.injector.get(NavigationService);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.screenService = this.injector.get(ScreenService);
    this.currentAnswersService = this.injector.get(CurrentAnswersService);
    this.eventBusService = this.injector.get(EventBusService);
  }

  abstract nextStep(data?: NavigationPayload | string): void;
}
