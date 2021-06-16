import { ValidationShowOn } from '@epgu/epgu-lib';
import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UnsubscribeService, UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';

@Component({
  selector: 'epgu-constructor-department-lookup',
  templateUrl: './department-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DepartmentLookupComponent extends AbstractComponentListItemComponent {
  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );
  dictionaries$ = this.dictionaryToolsService.dictionaries$.pipe(
    map((dictionaries) => dictionaries[UtilsService.getDictKeyByComp(this.control.value)]),
  );
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    private screenService: ScreenService,
    public suggestHandlerService: SuggestHandlerService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
