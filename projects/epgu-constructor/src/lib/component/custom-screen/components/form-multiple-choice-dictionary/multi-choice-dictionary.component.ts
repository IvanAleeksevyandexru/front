import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryFilters, DictionaryOptions } from '@epgu/epgu-constructor-types';
import MultipleChoiceDictionaryModelAttrs from './MultipleChoiceDictionaryModelAttrs';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';
import { takeUntil } from 'rxjs/operators';
import { isUndefined } from 'lodash';
import { MultipleChoiceDictionaryComponent } from '../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary/multiple-choice-dictionary.component';
import { MultipleSelectedItems } from '../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary.models';

@Component({
  selector: 'epgu-constructor-multi-choice-dictionary',
  templateUrl: './multi-choice-dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MultiChoiceDictionaryComponent
  extends AbstractDictionaryLikeComponent<MultipleChoiceDictionaryModelAttrs>
  implements OnInit {
  @ViewChild('multipleChoiceDictionaryComponent', { static: false })
  multipleChoiceDictionaryComponent: MultipleChoiceDictionaryComponent;
  dictionaryFilter: DictionaryFilters;
  dictionaryOptions: DictionaryOptions;
  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dictionaryFilter = this.dictionaryToolsService.getFilterOptions(
      this.formService.form,
      this.screenService.getStore(),
      this.attrs.dictionaryFilter,
    );
  }

  protected watchForFilters(): void {
    this.componentsListRelationsService.filters$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((filters) => {
        const isFilterInited = !isUndefined(filters[this.model.id]);

        if (isFilterInited) {
          this.dictionaryOptions = this.prepareDictionaryOptions(filters);
        }

        this.clearComponentValue();
      });
  }

  private clearComponentValue(): void {
    this.multipleChoiceDictionaryComponent?.writeValue({
      list: [],
      amount: 0,
    } as MultipleSelectedItems);
  }
}
