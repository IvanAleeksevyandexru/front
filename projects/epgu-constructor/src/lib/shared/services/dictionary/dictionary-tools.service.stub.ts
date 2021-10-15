import { Injectable } from '@angular/core';
import { ListItem } from '@epgu/ui/models/dropdown';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CustomComponentDropDownItem,
  CustomComponentDropDownItemList,
  CustomListDictionaries,
  CustomListDropDowns,
} from '../../../component/custom-screen/components-list.types';

@Injectable()
export class DictionaryToolsServiceStub {
  private _dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);
  private _dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  get dropDowns$(): Observable<{}> {
    return this._dropDowns$;
  }

  get dictionaries$(): BehaviorSubject<CustomListDictionaries> {
    return this._dictionaries$;
  }

  getDictionaries$() {
    return new Observable().pipe();
  }

  getFilterOptions() {
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

  getValueViaRef() {
    return null;
  }

  getDictionaryFirstState() {
    return {};
  }

  adaptDictionaryToListItem() {
    return {};
  }

  dictionaryFiltersLoader() {
    return new Observable();
  }

  loadReferenceData$() {
    return new Observable();
  }

  watchForFilters() {
    return new Observable();
  }
}
