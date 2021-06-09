import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-city-input',
  templateUrl: './city-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class CityInputComponent extends AbstractComponentListItemComponent {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;

  constructor(public injector: Injector) {
    super(injector);
  }
}
