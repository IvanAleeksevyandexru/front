import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import {
  ListElement,
  LookupPartialProvider,
  LookupProvider,
} from 'epgu-lib/lib/models/dropdown.model';

import { AbstractControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib/lib/models/validation-show';
import { LookupComponent } from 'epgu-lib';

@Component({
  selector: 'epgu-constructor-constructor-lookup',
  templateUrl: './constructor-lookup.component.html',
})
export class ConstructorLookupComponent {
  @ContentChild(LookupComponent, { static: false })
  lookupComponent: LookupComponent;

  @Input() id: string | number;
  @Input() control: AbstractControl;
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() clearable: boolean;
  @Input() virtualScroll: boolean;
  @Input() searchCaseSensitive: boolean;
  @Input() queryMinSymbolsCount: number;
  @Input() fixedItems: Array<ListElement>;
  @Input() itemsProvider: LookupProvider<ListElement> | LookupPartialProvider<ListElement>;
  @Input() showSuggestion: boolean;
  @Input() showExpandCollapse: boolean;
  @Input() disabled: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() changed = new EventEmitter<ListElement>();

  public onChanged(item: ListElement): void {
    this.changed.emit(item);
  }

  public clearInput(): void {
    this.lookupComponent.clearInput();
  }
}
