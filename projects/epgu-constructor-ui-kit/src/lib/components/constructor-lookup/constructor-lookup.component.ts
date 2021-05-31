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
  ListItem,
  LookupComponent,
  ValidationShowOn,
  ListElement,
  LookupPartialProvider,
  LookupProvider,
} from '@epgu/epgu-lib';

@Component({
  selector: 'epgu-cf-ui-constructor-constructor-lookup',
  templateUrl: './constructor-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
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
  @Input() queryMinSymbolsCount = 0;
  @Input() fixedItems: Array<ListElement>;
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
}
