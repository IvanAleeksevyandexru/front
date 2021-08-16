import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryFilters } from '@epgu/epgu-constructor-types';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-multi-choice-dictionary',
  templateUrl: './multi-choice-dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MultiChoiceDictionaryComponent extends AbstractComponentListItemComponent
  implements OnInit {
  dictionaryFilter: DictionaryFilters;
  constructor(
    public injector: Injector,
    private dictionaryToolsService: DictionaryToolsService,
    private screenService: ScreenService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dictionaryFilter = this.dictionaryToolsService.getFilterOptions(
      this.formService.form,
      this.screenService.getStore(),
      this.control.value.attrs.dictionaryFilter,
    );
  }
}
