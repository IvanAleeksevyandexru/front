import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../../components-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class CheckboxInputComponent extends AbstractComponentListItemComponent {
  constructor(public injector: Injector) {
    super(injector);
  }
}
