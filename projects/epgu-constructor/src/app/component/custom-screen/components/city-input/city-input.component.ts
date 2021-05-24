import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';

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
