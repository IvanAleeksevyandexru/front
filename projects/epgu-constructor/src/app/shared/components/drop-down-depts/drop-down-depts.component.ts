import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { Suggest, SuggestItem } from 'epgu-lib/lib/models/suggest';
import { ISuggestionItem } from '../../../core/services/autocomplete/autocomplete.inteface';
import { CustomListDictionary } from '../../../component/custom-screen/components-list.types';
import IDropDownDeptsAttrs from './IDropDownDeptsAttrs';

@Component({
  selector: 'epgu-constructor-drop-down-depts',
  templateUrl: './drop-down-depts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownDeptsComponent {
  @Input() invalid: boolean;
  @Input() dictionary: CustomListDictionary;
  @Input() required: boolean;
  @Input() validationShowOn: ValidationShowOn;
  @Input() control: AbstractControl;
  @Input() clearable: boolean;
  @Input() queryMinSymbolsCount: number;
  @Input() searchCaseSensitive: boolean;
  @Input() virtualScroll: boolean;
  @Input() suggest: ISuggestionItem;
  @Input() attrs: IDropDownDeptsAttrs;

  @Output() selectSuggest = new EventEmitter<Suggest | SuggestItem>();

  public get disabled(): boolean {
    const isOnlyOneElement = this.dictionary?.list?.length === 1;
    const isLocked = this.attrs.lockedValue && !this.dictionary?.repeatedWithNoFilters;

    return isOnlyOneElement || isLocked;
  }

  public suggestHandle(event: Suggest | SuggestItem): void {
    this.selectSuggest.emit(event);
  }
}
