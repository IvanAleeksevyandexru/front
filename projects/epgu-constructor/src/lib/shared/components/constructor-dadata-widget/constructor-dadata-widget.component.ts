import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { AbstractControl } from '@angular/forms';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';

@Component({
  selector: 'epgu-constructor-constructor-dadata-widget',
  templateUrl: './constructor-dadata-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorDadataWidgetComponent {
  @Input() simpleMode: boolean;
  @Input() hideLevels?: string[];
  @Input() hideHouseCheckbox: boolean;
  @Input() hideApartmentCheckbox: boolean;
  @Input() selectHouseCheckbox: boolean;
  @Input() selectApartmentCheckbox: boolean;
  @Input() externalApiUrl?: string;
  @Input() id: string;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() invalid: boolean;
  @Input() clearable: boolean;
  @Input() control: AbstractControl;
  @Input() suggestions?: ISuggestionItem;

  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();
}
