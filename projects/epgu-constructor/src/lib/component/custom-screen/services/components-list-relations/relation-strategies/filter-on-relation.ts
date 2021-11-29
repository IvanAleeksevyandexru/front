import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../../screen/screen.service';

export class FilterOnRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
    _components: CustomComponent[],
    _initInitialValues: boolean,
    dictionaryToolsService: DictionaryToolsService,
    screenService: ScreenService,
  ): CustomListStatusElements {
    if (
      this.refRelationService.isValueEquals(reference.val, componentVal) &&
      dictionaryToolsService.isDictionaryLike(dependentComponent.type)
    ) {
      const filter = dictionaryToolsService.getFilterOptions(
        componentVal,
        screenService.getStore(),
        reference.dictionaryFilter,
      );
      dictionaryToolsService.applyFilter(dependentComponent.id, filter.filter);
    } else {
      dictionaryToolsService.clearFilter(dependentComponent.id);
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
