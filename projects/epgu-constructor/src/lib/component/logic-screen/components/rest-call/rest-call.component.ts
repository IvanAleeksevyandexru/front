import { ChangeDetectionStrategy, Component } from '@angular/core';
import { forkJoin, ObservableInput, of, TimeoutError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, concatMap, map, takeUntil, tap, timeout } from 'rxjs/operators';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponents, NavigationPayload } from '@epgu/epgu-constructor-types';
import AbstractLogicComponent from '../abstract-logic/abstract-logic.component';
import { ScreenService } from '../../../../screen/screen.service';
import { LogicService } from '../../service/logic.service';
import { HookService } from '../../../../core/services/hook/hook.service';
import { HookTypes } from '../../../../core/services/hook/hook.constants';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { COMMON_ERROR_MODAL_PARAMS_TEXT } from '../../../../core/services/error-handler/error-handler';

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
    private modalErrorService: ModalErrorService,
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
      timeout(
        this.screenService.trobber?.timeout
          ? this.screenService.trobber.timeout * 1000
          : this.logicService.maxTimeout,
      ),
      tap(() => {
        this.screenService.isLogicComponentLoading = true;
      }),
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
        this.screenService.isLogicComponentLoading = false;
        this.screenService.logicAnswers =
          typeof this.screenService.logicAnswers === 'object' && this.screenService.logicAnswers
            ? {
                ...this.screenService.logicAnswers,
                ...response,
              }
            : response;
      }),
      catchError((error: Error) => {
        if (error && error instanceof TimeoutError) {
          this.modalErrorService.showError(COMMON_ERROR_MODAL_PARAMS_TEXT);
        }
        this.screenService.isLogicComponentLoading = false;
        return this.screenService.logicComponents$;
      }),
      takeUntil(this.unSubscribeService$),
    );
  }
}
