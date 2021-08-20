import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CustomScreenComponentTypes } from '../../components-list.types';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';

@Component({
  selector: 'epgu-constructor-form-output-html',
  templateUrl: './form-output-html.component.html',
  styleUrls: ['form-output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FormOutputHtmlComponent extends AbstractComponentListItemComponent {
  outputHtmlClass: Partial<Record<CustomScreenComponentTypes, string>> = {
    [CustomScreenComponentTypes.LabelSection]: 'label',
    [CustomScreenComponentTypes.HtmlString]: 'info__text',
  };

  constructor(public injector: Injector, private interpolationService: InterpolationService) {
    super(injector);
  }

  public label(): string {
    return this.control?.value?.attrs?.interpolationEnabled
      ? this.interpolationService.interpolateString(
          this.control?.value?.label,
          this.control?.value?.value,
        )
      : this.control?.value?.label;
  }
}
