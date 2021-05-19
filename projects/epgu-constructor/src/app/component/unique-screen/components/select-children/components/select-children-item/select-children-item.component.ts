import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { ListElement } from '@epgu/epgu-lib';

import { ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ChildI } from '../../select-children.models';
import {
  CustomComponent,
  CustomComponentOutputData,
} from '../../../../../custom-screen/components-list.types';

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
  @Input() children: Array<ListElement>;
  @Input() errors: ScenarioErrorsDto;
  @Input() isNewChild: boolean;
  @Input() components: Array<CustomComponent>;
  @Input() control: AbstractControl;
  @Output() selectChildrenEvent = new EventEmitter<ChildI>();
  @Output() updateChildEvent = new EventEmitter<CustomComponentOutputData>();
  @Output() updateItemValueAndValidityEvent = new EventEmitter<void>();
  @Output() updateItemValidatorsEvent = new EventEmitter<FormArray>();

  public selectChildren(value: ChildI): void {
    this.selectChildrenEvent.emit(value);
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
