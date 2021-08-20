import { Component, ChangeDetectionStrategy, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { map } from 'rxjs/operators';

import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { getDictKeyByComp } from '../../../../shared/services/dictionary/dictionary-helper';

@Component({
  selector: 'epgu-constructor-dictionary',
  templateUrl: './dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryComponent extends AbstractComponentListItemComponent implements OnInit {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  list$ = this.dictionaryToolsService.dictionaries$.pipe(
    map((dictionaries) => dictionaries[getDictKeyByComp(this.control.value)]?.list),
  );

  constructor(public injector: Injector, public dictionaryToolsService: DictionaryToolsService) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.list$.subscribe((data) => {
      if (data?.length === 1 && data[0].id && data[0].text) {
        this.control.get('value').setValue(data[0]);
      }
    });
  }
}
