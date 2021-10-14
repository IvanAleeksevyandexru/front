import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import AddressInputModelAttrs from './AddressInputModelAttrs';

@Component({
  selector: 'epgu-constructor-address-input',
  templateUrl: './address-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class AddressInputComponent extends AbstractComponentListItemComponent<
  AddressInputModelAttrs
> {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return this.processSuggestions(suggestions);
    }),
  );

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;

  constructor(
    public injector: Injector,
    public configService: ConfigService,
    public screenService: ScreenService,
    public suggestHandlerService: SuggestHandlerService,
  ) {
    super(injector);
  }

  private processSuggestions(suggestions: { [key: string]: ISuggestionItem }): ISuggestionItem {
    const addressSuggestions = suggestions[this.control.value?.id];
    addressSuggestions?.list.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.value = JSON.parse(item.originalItem).fullAddress;
    });

    return addressSuggestions;
  }
}
