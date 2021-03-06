import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ListElement } from '@epgu/ui/models/dropdown';

@Component({
  selector: 'epgu-cf-ui-constructor-constructor-dropdown',
  templateUrl: './constructor-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorDropdownComponent {
  @Input() id: string | number;
  @Input() control: AbstractControl;
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() clearable = true;
  @Input() disabled: boolean;
  @Input() localSearch: boolean;
  @Input() placeholder?: string = '&mdash;';
  @Input() items: ListElement[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() changed = new EventEmitter<ListElement | any>(); // TODO: подумать над рефактором подписочной модели

  public onChanged(item: ListElement): void {
    this.changed.emit(item);
  }
}
