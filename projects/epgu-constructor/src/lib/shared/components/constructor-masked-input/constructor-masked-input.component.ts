import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { NumberMaskOptionsInterface } from '@epgu/epgu-constructor-ui-kit';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';

@Component({
  selector: 'epgu-constructor-masked-input',
  templateUrl: './constructor-masked-input.component.html',
  styleUrls: ['./constructor-masked-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorMaskedInputComponent {
  @Input() control: FormControl;
  @Input() validationShowOn: ValidationShowOn;
  @Input() textTransformType: TextTransform;
  @Input() readonly: boolean;
  @Input() showConstantMaskSymbols = true;
  @Input() showMaskAsPlaceholder: boolean;
  @Input() clearable: boolean;
  @Input() invalid: boolean;
  @Input() mask: string | string[];
  @Input() maskOptions?: Partial<NumberMaskOptionsInterface>;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() isTrim?: boolean;
  @Input() component?: CustomComponent;
  @Input() suggestions?: ISuggestionItem;
  @Input() showPlaceholderOnFocus?: boolean;

  @Output() blurEvent = new EventEmitter<void>();
  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  public onChange($event: Event): void {
    if (this.control.updateOn === 'blur') {
      const input = $event.target as HTMLInputElement;
      this.control.setValue(input.value);
      this.control.updateValueAndValidity();
    }
  }

  public onBlur(): void {
    this.blurEvent.emit();
  }
}
