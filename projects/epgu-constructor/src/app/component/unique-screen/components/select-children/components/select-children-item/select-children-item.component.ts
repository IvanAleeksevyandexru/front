import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScenarioErrorsDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ChildI, ItemStatus } from '../../select-children.models';
import {
  CustomComponent,
  CustomComponentOutputData,
} from '../../../../../shared/components/components-list/components-list.types';

@Component({
  selector: 'epgu-constructor-select-children-item',
  templateUrl: './select-children-item.component.html',
  styleUrls: ['./select-children-item.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenItemComponent {
  @Input() idx: number;
  @Input() children: Array<ListElement>;
  @Input() errors: ScenarioErrorsDto;
  @Input() isNewChild: boolean;
  @Input() components: Array<CustomComponent>;
  @Input() control: AbstractControl;
  @Output() selectChildrenEvent = new EventEmitter<ChildI>();
  @Output() updateChildEvent = new EventEmitter<CustomComponentOutputData>();
  @Output() updateItemValidationStatusEvent = new EventEmitter<ItemStatus>();

  public selectChildren(value: ChildI): void {
    this.selectChildrenEvent.emit(value);
  }

  public updateChild(childData: CustomComponentOutputData): void {
    this.updateChildEvent.emit(childData);
  }

  public updateItemValidationStatus(status: ItemStatus): void {
    this.updateItemValidationStatusEvent.emit(status);
  }
}
