import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import TimerItemModelAttrs from './TimerItemModelAttrs';

@Component({
  selector: 'epgu-constructor-timer-item',
  templateUrl: './timer-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class TimerItemComponent extends AbstractComponentListItemComponent<TimerItemModelAttrs> {
  constructor(public injector: Injector) {
    super(injector);
  }
}
