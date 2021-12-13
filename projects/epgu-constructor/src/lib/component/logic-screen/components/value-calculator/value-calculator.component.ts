import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { Observable, of } from 'rxjs';
import AbstractLogicComponent from '../abstract-logic/abstract-logic.component';

@Component({
  selector: 'epgu-constructor-value-calculator',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export default class ValueCalculatorComponent extends AbstractLogicComponent {
  // eslint-disable-next-line no-empty-function
  protected handleOnBeforeSubmitEvent(): void {}
  // eslint-disable-next-line no-empty-function
  protected handleOnBeforeRejectEvent(): void {}

  protected handleFetchEvent(): Observable<{}> {
    return of(null);
  }
}
