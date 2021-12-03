import { ChangeDetectionStrategy, Component } from '@angular/core';
import { forkJoin, ObservableInput, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, concatMap, delay, map, takeUntil, tap } from 'rxjs/operators';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponents, NavigationPayload } from '@epgu/epgu-constructor-types';
import AbstractLogicComponent from '../abstract-logic/abstract-logic.component';
import { ScreenService } from '../../../../screen/screen.service';
import { LogicService } from '../../service/logic.service';
import { HookService } from '../../../../core/services/hook/hook.service';
import { HookTypes } from '../../../../core/services/hook/hook.constants';

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
    this.hookService.addHook(HookTypes.ON_BEFORE_SUBMIT, this.handleDataFetching());
  }

  protected handleOnBeforeRejectEvent(): void {
    this.hookService.addHook(HookTypes.ON_BEFORE_REJECT, this.handleDataFetching());
  }

  protected handleDataFetching(): ObservableInput<NavigationPayload> {
    return of(null).pipe(
      concatMap(() => {
        return this.handleFetchEvent();
      }),
    );
  }

  protected handleFetchEvent(): Observable<{}> {
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
