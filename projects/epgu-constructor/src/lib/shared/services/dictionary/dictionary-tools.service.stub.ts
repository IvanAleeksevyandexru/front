import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DictionaryToolsServiceStub {
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
