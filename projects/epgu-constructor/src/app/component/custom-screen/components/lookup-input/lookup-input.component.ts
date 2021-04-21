import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ConstantsService, ValidationShowOn } from 'epgu-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../screen/screen.service';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { ConfigService } from '../../../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-lookup-input',
  templateUrl: './lookup-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LookupInputComponent extends AbstractComponentListItemComponent {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  dictionariesList$ = this.dictionaryToolsService.dictionaries$.pipe(
    map((dictionaries) => dictionaries[UtilsService.getDictKeyByComp(this.control.value)]?.list),
  );

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    public suggestHandlerService: SuggestHandlerService,
    private screenService: ScreenService,
    private config: ConfigService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
