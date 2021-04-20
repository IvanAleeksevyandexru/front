import { Component, ChangeDetectionStrategy } from '@angular/core';
import { catchError, delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin } from 'rxjs';

import { ScreenService } from '../../../screen/screen.service';
import { ComponentValue } from '../logic.types';
import { LogicService } from '../service/logic.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-logic',
  templateUrl: './logic.component.html',
  styleUrls: ['./logic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LogicComponent {
  isLoading$ = new BehaviorSubject<boolean>(false);
  components$ = this.screenService.logicComponents$.pipe(
    filter((components) => components.length > 0),
    map((components) => {
      this.isLoading$.next(true);
      return components.map((component) => ({
        id: component.id,
        value: JSON.parse(component.value) as ComponentValue,
      }));
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
      this.screenService.logicAnswers = response;
    }),
    catchError(() => this.screenService.logicComponents$),
    delay(500),
    tap(() => this.isLoading$.next(false)),
    takeUntil(this.unSubscribeService$),
  );

  constructor(
    private screenService: ScreenService,
    private logicService: LogicService,
    private unSubscribeService$: UnsubscribeService,
  ) {
    this.components$.subscribe();
  }
}
