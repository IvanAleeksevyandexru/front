import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

@Component({
  selector: 'epgu-constructor-constructor-dropdown',
  templateUrl: './constructor-dropdown.component.html',
})
export class ConstructorDropdownComponent implements OnInit {
  @Input() id: string | number;
  @Input() control: AbstractControl;
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() clearable: boolean;
  @Input() disabled: boolean;
  @Input() localSearch: boolean;
  @Input() placeholder?: string = '&mdash;';
  @Input() items: Array<ListElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() changed = new EventEmitter<ListElement | any>();

  public onChanged(item: ListElement): void {
    this.changed.emit(item);
  }

  ngOnInit(): void {}
}
