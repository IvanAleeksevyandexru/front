import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ConstantsService, ValidationShowOn } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ScreenService } from '../../../../screen/screen.service';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';

import { SUGGEST_SEPARATOR_DEFAULT } from '../../../../core/services/autocomplete/autocomplete.const';
import { getDictKeyByComp } from '../../../../shared/services/dictionary/dictionary-helper';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';

@Component({
  selector: 'epgu-constructor-rest-lookup-input',
  templateUrl: './rest-lookup-input.component.html',
  styleUrls: ['./rest-lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [UnsubscribeService],
})
export class RestLookupInputComponent extends AbstractComponentListItemComponent implements OnInit {
  public provider;

  public showNotFound;

  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  dictionariesList$ = this.restToolsService.dictionaries$.pipe(
    map((dictionaries) => dictionaries[getDictKeyByComp(this.control.value)]?.list),
  );

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  constructor(
    private restToolsService: RestToolsService,
    public suggestHandlerService: SuggestHandlerService,
    private screenService: ScreenService,
    private config: ConfigService,
    public injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showNotFound = !!this.control.value.attrs.hint;
  }
}
