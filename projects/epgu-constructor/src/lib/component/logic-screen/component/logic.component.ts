import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponentEventTypes, LogicComponents } from '@epgu/epgu-constructor-types';
import { Observable } from 'rxjs/internal/Observable';
import { ScreenService } from '../../../screen/screen.service';
import { LogicService } from '../service/logic.service';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookTypes } from '../../../core/services/hook/hook.constants';

@Component({
  selector: 'epgu-constructor-logic',
  templateUrl: './logic.component.html',
  styleUrls: ['./logic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LogicComponent implements OnInit {
  isLoading$ = this.screenService.isLogicComponentLoading$;
  logicComponents$ = this.screenService.logicComponents$.pipe(
    tap((logicComponents: LogicComponents[]) => {
      this.setHooks(logicComponents);
    }),
    map((logicComponents: LogicComponents[]) =>
      logicComponents.filter(
        (logicComponent: LogicComponents) =>
          !logicComponent.attrs.events ||
          logicComponent.attrs.events.indexOf(LogicComponentEventTypes.ON_INIT) !== -1,
      ),
    ),
    filter((logicComponents: LogicComponents[]) => logicComponents.length > 0),
  );

  constructor(
    private screenService: ScreenService,
    private logicService: LogicService,
    private unSubscribeService$: UnsubscribeService,
    private hookService: HookService,
  ) {}

  ngOnInit(): void {
    this.applyPipe(this.logicComponents$).subscribe();
  }

  private setHooks(logicComponents: LogicComponents[]): void {
    const onBeforeSubmitComponents = logicComponents.filter(
      (logicComponent: LogicComponents) =>
        logicComponent.attrs.events &&
        logicComponent.attrs.events.indexOf(LogicComponentEventTypes.ON_BEFORE_SUBMIT) !== -1,
    );

    if (onBeforeSubmitComponents.length > 0) {
      this.hookService.addHook(
        HookTypes.ON_BEFORE_SUBMIT,
        this.applyPipe(of(onBeforeSubmitComponents)),
      );
    } else {
      this.hookService.clearHook(HookTypes.ON_BEFORE_SUBMIT);
    }
  }

  private applyPipe(observable: Observable<{}>): Observable<{}> {
    return observable.pipe(
      map((logicComponents: LogicComponents[]) => {
        this.screenService.isLogicComponentLoading = true;
        return logicComponents.map((logicComponent) => ({
          id: logicComponent.id,
          attrs: logicComponent.attrs,
          value: JSON.parse(logicComponent.value as string),
        })) as LogicComponents[];
      }),
      map((components) => this.logicService.fetch(components)),
      switchMap((components) => forkJoin(components)),
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
      tap(() => {
        this.screenService.isLogicComponentLoading = false;
      }),
      takeUntil(this.unSubscribeService$),
    );
  }
}
