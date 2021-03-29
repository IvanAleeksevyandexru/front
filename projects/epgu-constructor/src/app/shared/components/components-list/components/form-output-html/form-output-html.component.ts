import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CustomScreenComponentTypes } from '../../components-list.types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemDirective } from '../abstract-component-list-item/abstract-component-list-item.directive';

@Component({
  selector: 'epgu-constructor-form-output-html',
  templateUrl: './form-output-html.component.html',
  styleUrls: ['form-output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FormOutputHtmlComponent extends AbstractComponentListItemDirective {
  outputHtmlClass: Partial<Record<CustomScreenComponentTypes, string>> = {
    [CustomScreenComponentTypes.LabelSection]: 'label',
    [CustomScreenComponentTypes.HtmlString]: 'info__text',
  };

  constructor(public injector: Injector) {
    super(injector);
  }
}
