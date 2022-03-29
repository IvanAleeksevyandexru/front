import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import AddressInputModelAttrs from './AddressInputModelAttrs';
import { ConfirmAddressErrorsInterface } from '../../../unique-screen/components/confirm-personal-user-address-screen/interface/confirm-address.interface';

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
  groupedErrors: ConfirmAddressErrorsInterface[] = [];
  stringError: string = '';

  constructor(
    public injector: Injector,
    public configService: ConfigService,
    public screenService: ScreenService,
    public suggestHandlerService: SuggestHandlerService,
  ) {
    super(injector);
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    super.ngOnInit();
    this.screenService.componentError$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((errors) => {
      this.setErrors(errors);
    });
  }

  private processSuggestions(suggestions: { [key: string]: ISuggestionItem }): ISuggestionItem {
    const addressSuggestions = suggestions[this.control.value?.id];
    addressSuggestions?.list.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.value =
        JSON.parse(item.originalItem).regAddr?.fullAddress ||
        JSON.parse(item.originalItem).fullAddress;
    });

    return addressSuggestions;
  }

  private getGroupedErrors(errors): ConfirmAddressErrorsInterface[] {
    return Object.values(
      errors.reduce((accumulator, { desc, icon, title, type }) => {
        accumulator[title] = {
          desc:
            title in accumulator && accumulator[title].desc !== desc
              ? `${accumulator[title].desc} <br> ${desc}`
              : desc,
          icon,
          title,
          type,
        };

        return accumulator;
      }, {}),
    );
  }

  private setErrors(errors: string): void {
    if (!errors) {
      this.stringError = '';
      this.groupedErrors = [];
      return;
    }

    try {
      this.groupedErrors = this.getGroupedErrors(Object.values(JSON.parse(errors)));
      this.stringError = '';
    } catch (err) {
      this.stringError = errors;
      this.groupedErrors = [];
    }
  }
}
