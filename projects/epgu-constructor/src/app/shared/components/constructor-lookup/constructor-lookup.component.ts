import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import {
  ListElement,
  LookupPartialProvider,
  LookupProvider,
} from 'epgu-lib/lib/models/dropdown.model';
import { LookupComponent, ValidationShowOn } from 'epgu-lib';

@Component({
  selector: 'epgu-constructor-constructor-lookup',
  templateUrl: './constructor-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorLookupComponent {
  @ViewChild('lookupComponent', { static: false })
  lookupComponent: LookupComponent;

  @Input() showNotFound = false;
  @Input() id: string | number;
  @Input() control: AbstractControl = new FormControl();
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() clearable: boolean;
  @Input() virtualScroll: boolean;
  @Input() searchCaseSensitive: boolean;
  @Input() queryMinSymbolsCount: number;
  @Input() fixedItems: Array<ListElement>;
  @Input() itemsProvider:
    | LookupProvider<Partial<ListElement>>
    | LookupPartialProvider<Partial<ListElement>>;
  @Input() showSuggestion: boolean;
  @Input() showExpandCollapse: boolean;
  @Input() disabled: boolean;
  @Output() changed = new EventEmitter<ListElement>();

  public onChanged(item: ListElement): void {
    this.changed.emit(item);
  }

  public clearInput(): void {
    this.lookupComponent.clearInput();
  }
}
