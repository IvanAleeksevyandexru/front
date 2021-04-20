import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
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

@Component({
  selector: 'epgu-constructor-lookup-input',
  templateUrl: './lookup-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class LookupInputComponent extends AbstractComponentListItemComponent implements OnInit {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  dictionariesList$ = this.dictionaryToolsService.dictionaries$.pipe(
    map((dictionaries) => dictionaries[UtilsService.getDictKeyByComp(this.control.value)]?.list),
  );
  queryTimeout: number;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    public suggestHandlerService: SuggestHandlerService,
    private screenService: ScreenService,
    public injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    // eslint-disable-next-line no-restricted-globals
    this.queryTimeout = !isNaN(Number(this.control.value.attrs.queryTimeout))
      ? this.control.value.attrs.queryTimeout
      : ConstantsService.DEFAULT_QUERY_DEBOUNCE;
  }
}
