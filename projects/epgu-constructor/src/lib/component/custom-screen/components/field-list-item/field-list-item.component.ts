import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import FieldListModelAttrs from './FieldListModelAttrs';

@Component({
  selector: 'epgu-constructor-field-list-item',
  templateUrl: './field-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FieldListItemComponent extends AbstractComponentListItemComponent<
  FieldListModelAttrs
> {
  constructor(public injector: Injector) {
    super(injector);
  }
}
