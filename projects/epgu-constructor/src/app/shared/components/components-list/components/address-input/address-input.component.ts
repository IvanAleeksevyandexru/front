import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-address-input',
  templateUrl: './address-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class AddressInputComponent extends AbstractComponentListItemComponent {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;

  constructor(public injector: Injector, public configService: ConfigService) {
    super(injector);
  }
}
