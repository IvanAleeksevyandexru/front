import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RemoveMaskSymbols, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';
import { CustomComponent, UpdateOn } from '../../../component/custom-screen/components-list.types';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';
import { SUGGEST_SEPARATOR_DEFAULT } from '../../../core/services/autocomplete/autocomplete.const';

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
  @Input() maskOptions?: Partial<NumberMaskOptions>;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() isTrim?: boolean;
  @Input() component?: CustomComponent;
  @Input() suggestions?: ISuggestionItem;
  @Input() showPlaceholderOnFocus?: boolean;
  @Input() public placeholderSymbol = '_';
  @Input() public removeMaskSymbols: RemoveMaskSymbols = RemoveMaskSymbols.SKIP;

  @Output() blurEvent = new EventEmitter<void>();
  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  public onChange($event: Event): void {
    if (this.control.updateOn === UpdateOn.ON_BLUR) {
      const input = $event.target as HTMLInputElement;
      this.control.setValue(this.removeMaskSymbolsIfNeeded(input.value));
      this.control.updateValueAndValidity();
    }
  }

  public onBlur(): void {
    this.blurEvent.emit();
  }

  private removeMaskSymbolsIfNeeded(value: string): string {
    if (value && this.removeMaskSymbols === RemoveMaskSymbols.PLACEHOLDERS) {
      return value.replace(new RegExp(this.placeholderSymbol, 'g'), '');
    }
    return value;
  }
}
