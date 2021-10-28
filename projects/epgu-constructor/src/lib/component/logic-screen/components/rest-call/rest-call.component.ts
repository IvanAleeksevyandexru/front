import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, concatMap, delay, map, takeUntil, tap } from 'rxjs/operators';
import { LogicComponents } from '@epgu/epgu-constructor-types';
import { forkJoin, ObservableInput, of } from 'rxjs';
import AbstractLogicComponent from '../abstract-logic/abstract-logic.component';
import { ScreenService } from '../../../../screen/screen.service';
import { LogicService } from '../../service/logic.service';
import { HookService } from '../../../../core/services/hook/hook.service';
import { HookTypes } from '../../../../core/services/hook/hook.constants';
import { NavigationPayload } from '../../../../form-player/form-player.types';

@Component({
  selector: 'epgu-constructor-rest-call',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export default class RestCallComponent extends AbstractLogicComponent {
  constructor(
    private screenService: ScreenService,
    private logicService: LogicService,
    private unSubscribeService$: UnsubscribeService,
    private hookService: HookService,
  ) {
    super();
  }

  protected handleOnBeforeSubmitEvent(): void {
    this.hookService.addHook(HookTypes.ON_BEFORE_SUBMIT, this.handleBeforeSubmitDataFetching());
  }

  protected handleBeforeSubmitDataFetching(): ObservableInput<NavigationPayload> {
    return of(null).pipe(
      concatMap(() => {
        return this.handleOnInitEvent();
      }),
    );
  }

  protected handleOnInitEvent(): Observable<{}> {
    const fetchData = [
      {
        id: this.componentDto.id,
        attrs: this.componentDto.attrs,
        value: JSON.parse((this.componentDto.value as string) || '{}'),
      },
    ] as LogicComponents[];

    return forkJoin(this.logicService.fetch(fetchData)).pipe(
      map((response) => {
        return response.reduce(
          (acc, component) => ({
            ...acc,
            ...component,
          }),
          {},
        );
      }),
      tap((response) => {
        this.screenService.logicAnswers =
          typeof this.screenService.logicAnswers === 'object' && this.screenService.logicAnswers
            ? {
                ...this.screenService.logicAnswers,
                ...response,
              }
            : response;
      }),
      catchError(() => this.screenService.logicComponents$),
      delay(500),
      takeUntil(this.unSubscribeService$),
    );
  }
}
