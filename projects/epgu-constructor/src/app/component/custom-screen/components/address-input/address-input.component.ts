import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-address-input',
  templateUrl: './address-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class AddressInputComponent extends AbstractComponentListItemComponent {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
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
}
