import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { CustomListDropDowns } from '../../components-list.types';

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
