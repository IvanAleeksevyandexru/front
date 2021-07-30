import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { map } from 'rxjs/operators';

import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';

@Component({
  selector: 'epgu-constructor-dictionary',
  templateUrl: './dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryComponent extends AbstractComponentListItemComponent {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  list$ = this.dictionaryToolsService.dictionaries$.pipe(
    map(
      (dictionaries) =>
        dictionaries[DictionaryToolsService.getDictKeyByComp(this.control.value)]?.list,
    ),
  );

  constructor(public injector: Injector, public dictionaryToolsService: DictionaryToolsService) {
    super(injector);
  }
}
