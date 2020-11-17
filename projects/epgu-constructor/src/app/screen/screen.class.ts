import { Injector } from '@angular/core';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from './screen.service';
import { NavigationPayload } from '../form-player/form-player.types';

// Желательно больше не наследоваться потому что это может усложнить логику.
export abstract class ScreenClass {
  public navigationService: NavigationService;
  public ngUnsubscribe$: UnsubscribeService;
  public screenService: ScreenService;

  protected constructor(public injector: Injector) {
    this.navigationService = this.injector.get(NavigationService);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.screenService = this.injector.get(ScreenService);
  }

  subscribeToNavigatePrev() {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  /**
   * Возвращение на экран назад
   */
  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  abstract nextStep(data?: NavigationPayload): void;
}
