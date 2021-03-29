import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../../../core/services/autocomplete/autocomplete.inteface';

@Component({
  selector: 'epgu-constructor-passport-lookup',
  templateUrl: './passport-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportLookupComponent {
  @Input() control: FormGroup | AbstractControl;
  @Input() suggestions: ISuggestionItem;
  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();
}
