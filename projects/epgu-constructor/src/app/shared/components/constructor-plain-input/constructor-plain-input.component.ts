import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { CustomComponent } from '../../../component/shared/components/components-list/components-list.types';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { TextTransform } from '../../types/textTransform';

@Component({
  selector: 'epgu-constructor-constructor-plain-input',
  templateUrl: './constructor-plain-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorPlainInputComponent {
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

  constructor(private eventBusService: EventBusService) {}

  public suggestHandle(event: ISuggestionItem | ISuggestionItemList): void {
    if (Object.prototype.hasOwnProperty.call(event, 'isEdit')) {
      this.eventBusService.emit('suggestionsEditEvent', event);
    } else {
      this.eventBusService.emit('suggestionSelectedEvent', event);
    }
  }
}
