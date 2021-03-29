import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemDirective } from '../abstract-component-list-item/abstract-component-list-item.directive';

@Component({
  selector: 'epgu-constructor-text-area',
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class TextAreaComponent extends AbstractComponentListItemDirective {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(public injector: Injector) {
    super(injector);
  }
}
