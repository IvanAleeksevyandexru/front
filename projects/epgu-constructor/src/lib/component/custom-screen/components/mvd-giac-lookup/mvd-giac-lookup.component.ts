import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CustomListDropDowns } from '../../components-list.types';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-mvd-giac-lookup',
  templateUrl: './mvd-giac-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MvdGiacLookupComponent extends AbstractComponentListItemComponent {
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
