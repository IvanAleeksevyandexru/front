import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { PlainInputComponent } from '@epgu/ui/controls';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';
import { SUGGEST_SEPARATOR_DEFAULT } from '../../../core/services/autocomplete/autocomplete.const';

@Component({
  selector: 'epgu-constructor-constructor-plain-input',
  templateUrl: './constructor-plain-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorPlainInputComponent implements AfterViewInit {
  @Input() control: FormControl;
  @Input() validationShowOn: ValidationShowOn;
  @Input() textTransformType?: TextTransform;
  @Input() readOnly?: boolean;
  @Input() invalid?: boolean;
  @Input() name?: string;
  @Input() id?: string;
  @Input() placeholder?: string;
  @Input() price?: boolean;
  @Input() rank?: boolean;
  @Input() maxlength?: number;
  @Input() type?: string;
  @Input() pattern?: string;
  @Input() component?: CustomComponent;
  @Input() suggestions?: ISuggestionItem;

  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  @ViewChild('plainInput', { static: false }) plainInput: PlainInputComponent;

  readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  ngAfterViewInit(): void {
    if (this.control.touched && this.plainInput) {
      this.plainInput.touched = true;
    }
  }
}
