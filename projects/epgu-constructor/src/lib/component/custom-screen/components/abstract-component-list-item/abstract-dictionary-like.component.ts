import { Component, Injector, OnInit } from '@angular/core';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { isUndefined } from 'lodash';
import { Observable, of } from 'rxjs';
import { AbstractComponentListItemComponent } from './abstract-component-list-item.component';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { CustomListDictionary } from '../../components-list.types';

@Component({
  template: '',
})
export default abstract class AbstractDictionaryLikeComponent<T extends DictionarySharedAttrs>
  extends AbstractComponentListItemComponent<T>
  implements OnInit {
  protected screenService: ScreenService;
  protected dictionaryToolsService: DictionaryToolsService;
  protected componentsListRelationsService: ComponentsListRelationsService;

  constructor(public injector: Injector) {
    super(injector);
    this.screenService = this.injector.get(ScreenService);
    this.dictionaryToolsService = this.injector.get(DictionaryToolsService);
    this.componentsListRelationsService = this.injector.get(ComponentsListRelationsService);
  }

  get model(): DictionaryLikeModel {
    return this.control?.value?.model;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadReferenceData$().subscribe(() => {
      setTimeout(() => this.formService.patch(this.model), 0);
      this.formService.emitChanges();
    });
    this.watchForFilters();
  }

  protected loadReferenceData$(): Observable<CustomListDictionary> {
    if (this.attrs.isLoadingNeeded()) {
      const options = this.prepareOptions();
      return this.getDictionary(options);
    }
    return of(null);
  }

  protected prepareOptions(): DictionaryOptions {
    const { dictionaryOptions = null, dictionaryFilter = null } = this.attrs;
    const screenStore = this.screenService.getStore();
    const excludedParams = this.attrs?.dictionaryOptions?.excludedParams || [];
    const additionalParams = this.dictionaryToolsService.getAdditionalParams(screenStore, [
      ...(this.attrs?.dictionaryOptions?.additionalParams || []),
    ]);

    const defaultOptions: DictionaryOptions = { pageNum: 0 };
    return {
      ...defaultOptions,
      ...(dictionaryOptions || {}),
      ...(dictionaryFilter
        ? this.dictionaryToolsService.prepareOptions(this.model, screenStore, dictionaryFilter)
        : {}),
      ...{ excludedParams },
      ...{ additionalParams },
    };
  }

  protected getDictionary(options): Observable<CustomListDictionary> {
    return this.model.loadReferenceData$(
      this.dictionaryToolsService.getDictionaries$(this.attrs.dictionaryType, this.model, options),
    );
  }

  protected watchForFilters(): void {
    this.componentsListRelationsService.filters$.subscribe((filters) => {
      const isFilterInited = !isUndefined(filters[this.model.id]);
      const hasFilter = filters[this.model.id] !== null;

      if (isFilterInited) {
        const { dictionaryType, dictionaryOptions = null } = this.attrs;
        const options: DictionaryOptions = dictionaryOptions || { pageNum: 0 };

        if (hasFilter) {
          options.filter = filters[this.model.id];
        }
        this.model
          .getDictionariesByFilter(
            hasFilter,
            this.dictionaryToolsService.getDictionaries$(dictionaryType, this.model, options),
          )
          .subscribe(() => {
            this.formService.onAfterFilterOnRel(this.model);
            this.cdr.markForCheck();
            this.formService.emitChanges();
          });
      }
    });
  }
}
