import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import CheckboxInputModelAttrs from './CheckboxInputModelAttrs';

@Component({
  selector: 'epgu-constructor-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../../components-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class CheckboxInputComponent extends AbstractComponentListItemComponent<
  CheckboxInputModelAttrs
> {
  constructor(public injector: Injector) {
    super(injector);
  }
}
