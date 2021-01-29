import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { CustomComponent } from '../../../component/shared/components/components-list/components-list.types';
import { ISuggestionItem, ISuggestionItemList } from '../../../core/services/autocomplete/autocomplete.inteface';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { TextTransform } from '../../types/textTransform';

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
  @Input() showConstantMaskSymbols: boolean;
  @Input() showMaskAsPlaceholder: boolean;
  @Input() clearable: boolean;
  @Input() invalid: boolean;
  @Input() mask: Array<string> | Array<string | RegExp>;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() isTrim?: boolean;
  @Input() component?: CustomComponent;
  @Input() suggestions?: ISuggestionItem;
  @Input() showPlaceholderOnFocus?: boolean;

  constructor(private eventBusService: EventBusService) {}

  public onChange($event: Event): void {
    if (this.control.updateOn === 'blur') {
      const input = $event.target as HTMLInputElement;
      this.control.setValue(input.value);
      this.control.updateValueAndValidity();
    }
  }

  public suggestHandle(event: ISuggestionItem | ISuggestionItemList): void {
    if (Object.prototype.hasOwnProperty.call(event, 'list')) {
      this.eventBusService.emit('suggestionsEditEvent', event);
    } else {
      this.eventBusService.emit('suggestionSelectedEvent', event);
    }
  }
}
