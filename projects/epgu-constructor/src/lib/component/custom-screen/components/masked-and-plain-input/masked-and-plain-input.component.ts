import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import MaskedAndPlainInputModelAttrs from './MaskedAndPlainInputModelAttrs';

@Component({
  selector: 'epgu-constructor-masked-and-plain-input',
  templateUrl: './masked-and-plain-input.component.html',
  styleUrls: ['./masked-and-plain-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MaskedAndPlainInputComponent
  extends AbstractComponentListItemComponent<MaskedAndPlainInputModelAttrs>
  implements OnInit {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => suggestions[this.control.value?.id]),
  );
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  controlValue: string;

  get hasDisabledByCheckbox(): boolean {
    return typeof this.attrs?.disabledByCheckbox === 'string';
  }
  constructor(
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    public injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.controlValue = this.control.get('value').value;
  }

  changeCheckboxDisableStatus(): void {
    const inputControl = this.control.get('value');
    if (inputControl.disabled) {
      inputControl.enable();
      inputControl.setValue(this.controlValue);
    } else {
      inputControl.disable();
      this.controlValue = inputControl?.value;
      inputControl.setValue(this.attrs.disabledByCheckbox);
    }
  }
}
