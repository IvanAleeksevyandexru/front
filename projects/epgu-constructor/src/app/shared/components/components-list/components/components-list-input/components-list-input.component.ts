import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { AbstractControl, FormGroup } from '@angular/forms';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../../../core/services/autocomplete/autocomplete.inteface';

@Component({
  selector: 'epgu-constructor-components-list-input',
  templateUrl: './components-list-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsListInputComponent {
  @Input() control: FormGroup | AbstractControl;
  @Input() suggestions: ISuggestionItem;
  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.NONE;
}
