import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { ListElement } from '@epgu/ui/models/dropdown';
import { ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ChildI } from '../../select-children.models';
import {
  CustomComponent,
  CustomComponentOutputData,
} from '../../../../../custom-screen/components-list.types';
import { ScreenService } from '../../../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-select-children-item',
  templateUrl: './select-children-item.component.html',
  styleUrls: ['./select-children-item.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenItemComponent {
  @Input() idx: number;
  @Input() hint?: string;
  @Input() children: ListElement[];
  @Input() errors: ScenarioErrorsDto;
  @Input() isNewChild: boolean;
  @Input() components: CustomComponent[];
  @Input() control: AbstractControl;
  @Output() selectChildrenEvent = new EventEmitter<ChildI>();
  @Output() updateChildEvent = new EventEmitter<CustomComponentOutputData>();
  @Output() updateItemValueAndValidityEvent = new EventEmitter<void>();
  @Output() updateItemValidatorsEvent = new EventEmitter<FormArray>();

  isClearable = this.screenService?.component?.attrs?.isClearable ?? true;
  defaultLabelList = this.screenService?.component?.attrs?.defaultLabelList ?? '—';
  visibleComponents: string[] = this.screenService?.component?.attrs?.visibleComponents || [];
  writableComponents: string[] = this.screenService?.component?.attrs?.writableComponents || [];

  constructor(private screenService: ScreenService) {}

  public selectChildren(value: ChildI): void {
    this.selectChildrenEvent.emit(value);
  }

  showComponents(components: CustomComponent[]): CustomComponent[] {
    const result = components
      .filter((component) => this.visibleComponents.includes(component.id))
      .map((component) => {
        return {
          ...component,
          value: this.control.value[component.id] || null,
          attrs: { ...component.attrs, disabled: !this.writableComponents.includes(component.id) },
        };
      });
    return [...result];
  }

  public updateChild(childData: CustomComponentOutputData): void {
    this.updateChildEvent.emit(childData);
  }

  public updateItemValueAndValidity(): void {
    this.updateItemValueAndValidityEvent.emit();
  }

  public updateItemValidators(form: FormArray): void {
    this.updateItemValidatorsEvent.emit(form);
  }
}
