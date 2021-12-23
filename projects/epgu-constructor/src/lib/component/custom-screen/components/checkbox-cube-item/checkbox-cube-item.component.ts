import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';

import { CheckboxChange } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import CheckboxCubeItemModelAttrs from './CheckboxCubeItemModelAttrs';

@Component({
  selector: 'epgu-constructor-checkbox-cube-item',
  templateUrl: './checkbox-cube-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class CheckboxCubeItemComponent extends AbstractComponentListItemComponent<
  CheckboxCubeItemModelAttrs
> {
  constructor(public injector: Injector) {
    super(injector);
  }

  public handleCheckboxChange($event: CheckboxChange): void {
    this.emitToParentForm($event);
  }

  private emitToParentForm($event: CheckboxChange): void {
    const { changes, isValid } = $event;

    if (isValid) {
      this.control.get('value').setValue(changes);
    } else {
      this.control.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emitChanges();
  }
}
