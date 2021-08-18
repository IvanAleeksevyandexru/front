import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { get } from 'lodash';
import { CustomScreenComponentTypes } from '../../components-list.types';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

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

  constructor(public injector: Injector) {
    super(injector);
  }

  public label(): string {
    return this.control?.value?.attrs?.interpolationEnabled
      ? this.control?.value?.label.replace(/\${(\w(\w|\d|_|\.)*)}/gi, (_: string, p1: string) =>
          this.getValueByPath(p1),
        )
      : this.control?.value?.label;
  }

  private getValueByPath(path: string): string {
    return get(this.control?.value?.value, path, '');
  }
}
