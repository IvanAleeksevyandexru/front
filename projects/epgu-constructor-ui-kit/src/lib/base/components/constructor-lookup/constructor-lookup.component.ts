import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { LookupComponent } from '@epgu/ui/controls';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import {
  ListItem,
  ListElement,
  LookupPartialProvider,
  LookupProvider,
} from '@epgu/ui/models/dropdown';

@Component({
  selector: 'epgu-cf-ui-constructor-constructor-lookup',
  templateUrl: './constructor-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ConstructorLookupComponent {
  @ViewChild('lookupComponent', { static: false })
  lookupComponent: LookupComponent;

  @Input() searchOnFocus = false;
  @Input() showNotFound = false;
  @Input() clearInconsistent: string;
  @Input() placeholder: string;
  @Input() id: string | number;
  @Input() control: AbstractControl = new FormControl();
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() clearable: boolean;
  @Input() virtualScroll: boolean;
  @Input() searchCaseSensitive: boolean;
  @Input() hideSearchResult = false;
  @Input() queryMinSymbolsCount = 0;
  @Input() fixedItems: ListElement[];
  @Input() itemsProvider:
    | LookupProvider<Partial<ListElement>>
    | LookupPartialProvider<Partial<ListElement>>;
  @Input() showSuggestion: boolean;
  @Input() showExpandCollapse: boolean;
  @Input() showMagnifyingGlass: boolean;
  @Input() disabled: boolean;
  @Input() formatter: (item: ListItem, context: { [name: string]: unknown }) => string;
  @Output() changed = new EventEmitter<ListElement>(); // TODO: подумать над рефактором подписочной модели

  public onChanged(item: ListElement): void {
    this.changed.emit(item);
  }

  public clearInput(): void {
    this.lookupComponent.clearInput();
  }

  public setFocus(): void {
    this.lookupComponent.searchBar.setFocus();
  }
}
