import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import { UpdateFiltersEvents, UpdateFilterEvent } from '../components-list-relations.interface';
import { BehaviorSubject, Observable } from 'rxjs';

export class FilterOnRelation extends BaseRelation {
  private get filters(): UpdateFiltersEvents {
    return this._filters$.getValue();
  }

  private set filters(val: UpdateFiltersEvents) {
    this._filters$.next(val);
  }

  public get filters$(): Observable<UpdateFiltersEvents> {
    return this._filters$.asObservable();
  }

  private readonly _filters$: BehaviorSubject<UpdateFiltersEvents> = new BehaviorSubject({});

  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
    _components: CustomComponent[],
    _initInitialValues: boolean,
  ): CustomListStatusElements {
    if (this.refRelationService.isValueEquals(reference.val, componentVal)) {
      this.applyFilter(dependentComponent.id, { reference, value: componentVal });
    } else {
      this.clearFilter(dependentComponent.id);
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }

  private applyFilter(dependentComponentId: CustomComponent['id'], data: UpdateFilterEvent): void {
    this.filters = { [dependentComponentId]: data };
  }

  private clearFilter(dependentComponentId: CustomComponent['id']): void {
    if (this.filters[dependentComponentId]) {
      this.filters = { [dependentComponentId]: null };
    }
  }
}
