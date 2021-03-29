import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { CustomListDropDowns } from '../../components-list.types';
import { DictionaryToolsService } from '../../../../services/dictionary/dictionary-tools.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemDirective } from '../abstract-component-list-item/abstract-component-list-item.directive';

@Component({
  selector: 'epgu-constructor-mvd-giac-lookup',
  templateUrl: './mvd-giac-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MvdGiacLookupComponent extends AbstractComponentListItemDirective {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;
  queryMinSymbolsCount = 0;
  searchCaseSensitive = false;
  virtualScroll = true;
  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.dictionaryToolsService.dropDowns$;

  constructor(private dictionaryToolsService: DictionaryToolsService, public injector: Injector) {
    super(injector);
  }
}
