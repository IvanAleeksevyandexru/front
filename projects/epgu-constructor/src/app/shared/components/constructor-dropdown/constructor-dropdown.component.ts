import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationShowOn, ListElement } from '@epgu/epgu-lib';

@Component({
  selector: 'epgu-constructor-constructor-dropdown',
  templateUrl: './constructor-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorDropdownComponent implements OnInit {
  @Input() id: string | number;
  @Input() control: AbstractControl;
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() clearable = true;
  @Input() disabled: boolean;
  @Input() localSearch: boolean;
  @Input() placeholder?: string = '&mdash;';
  @Input() items: Array<ListElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() changed = new EventEmitter<ListElement | any>(); // TODO: подумать над рефактором подписочной модели

  public onChanged(item: ListElement): void {
    this.changed.emit(item);
  }

  ngOnInit(): void {}
}
