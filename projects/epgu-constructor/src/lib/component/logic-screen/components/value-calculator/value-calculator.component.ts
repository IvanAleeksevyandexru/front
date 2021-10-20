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
  protected handleOnBeforeSubmitEvent(): void {}

  protected handleOnInitEvent(): Observable<{}> {
    return of(null);
  }
}
