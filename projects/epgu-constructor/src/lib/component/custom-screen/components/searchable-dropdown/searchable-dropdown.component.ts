import { ValidationShowOn } from '@epgu/epgu-lib';
import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { CustomListDropDowns } from '../../components-list.types';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class SearchableDropdownComponent extends AbstractComponentListItemComponent {
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public clearable = true;
  public queryMinSymbolsCount = 0;
  public searchCaseSensitive = false;
  public virtualScroll = true;
  public dropDowns$: BehaviorSubject<CustomListDropDowns> = this.dictionaryToolsService.dropDowns$;

  public constructor(
    private dictionaryToolsService: DictionaryToolsService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
