import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ComponentDictionaryFilters } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.interface';

@Injectable()
export class DictionaryToolsServiceStub {
  private readonly _filters$: BehaviorSubject<ComponentDictionaryFilters> = new BehaviorSubject({});

  public get filters(): ComponentDictionaryFilters {
    return this._filters$.getValue();
  }

  public set filters(val: ComponentDictionaryFilters) {
    this._filters$.next(val);
  }

  public get filters$(): Observable<ComponentDictionaryFilters> {
    return this._filters$.asObservable();
  }

  public getDictionaries$() {
    return of({});
  }

  public getFilterOptions() {
    return {
      filter: {
        parentRefItemValue: '',
        selectAttributes: [''],
        treeFiltering: '',
        tx: '',
        withCredentials: true,
      },
    };
  }

  public getValueViaRef() {
    return null;
  }

  public getDictionaryFirstState() {
    return {};
  }

  public adaptDictionaryToListItem() {
    return {};
  }

  public dictionaryFiltersLoader() {
    return new Observable();
  }

  public loadReferenceData$() {
    return new Observable();
  }

  public watchForFilters() {
    return new Observable();
  }
}
