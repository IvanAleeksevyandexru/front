import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import DisclaimerModelAttrs from './DisclaimerModelAttrs';

@Component({
  selector: 'epgu-constructor-form-disclaimer',
  templateUrl: './form-disclaimer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FormDisclaimerComponent extends AbstractComponentListItemComponent<
  DisclaimerModelAttrs
> {
  constructor(public injector: Injector) {
    super(injector);
  }
}
