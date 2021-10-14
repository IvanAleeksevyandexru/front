import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import RadioInputModelAttrs from './RadioInputModelAttrs';

@Component({
  selector: 'epgu-constructor-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: ['../../components-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class RadioInputComponent extends AbstractComponentListItemComponent<RadioInputModelAttrs> {
  constructor(public injector: Injector) {
    super(injector);
  }
}
