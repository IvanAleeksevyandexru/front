import BaseModel from './BaseModel';
import DictionarySharedAttrs from './DictionarySharedAttrs';
import {
  CustomComponent,
  CustomComponentAttr,
  CustomListDictionary,
  CustomListGenericData,
} from '../components-list.types';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DictionaryItem, DictionaryResponse } from '../../../shared/services/dictionary/dictionary-api.types';
import {  switchMap } from 'rxjs/operators';
import { get, isUndefined } from 'lodash';
import { ListElement, ListItem } from '@epgu/ui/models/dropdown';

export default class DictionaryLikeModel extends BaseModel<DictionarySharedAttrs> {

  protected _dictionary$ = new BehaviorSubject<CustomListDictionary>(this.getDictionaryFirstState());

  constructor(componentDto: CustomComponent) {
    super(componentDto);
  }

  public get dictionary$(): Observable<CustomListDictionary> {
    return this._dictionary$.asObservable();
  }

  public get isResultEmpty(): boolean {
    return isUndefined(this._dictionary$.getValue()?.list?.length)
      ? false
      : this._dictionary$.getValue().list?.length === 0;
  }

  patchControlValue(control, screenStore): boolean {
    const dictionary = this._dictionary$.getValue();
    if (this.attrs.defaultIndex !== undefined && !this.value) {
      control.get('value').patchValue(dictionary.list[this.attrs.defaultIndex]);
      return true;
    } else if (this.attrs.lookupDefaultValue !== undefined && !this.value) {

      const { lookupDefaultValue, lookupFilterPath } = this.attrs;
      const isRef = String(lookupDefaultValue).includes('$');
      const specialCharactersRegExp = /[&\/\\#^,+()$~%'":*?<>{}]/g;
      const compareValue = isRef
        ? String(lookupDefaultValue).replace(specialCharactersRegExp, '')
        : lookupDefaultValue;

      let value: ListElement;

      if (lookupFilterPath) {
        value = dictionary.list.find(
          (item: ListItem) =>
            get(item, lookupFilterPath) ===
            (isRef ? get(screenStore, compareValue) : compareValue),
        );
      } else {
        value = dictionary?.list.find(({ id }) => id === lookupDefaultValue);
      }
      if (value) {
        control.get('value').patchValue(value);
      }
      return true;
    } else if (!this.value) {
      return true;
    }
  }


  getAttrs(attrs: CustomComponentAttr): DictionarySharedAttrs {
    return new DictionarySharedAttrs(attrs);
  }

  loadReferenceData$(dataSource: Observable<CustomListGenericData<DictionaryResponse>>): Observable<CustomListDictionary> {
    return dataSource.pipe(
      switchMap((dictionary) => {
      return this.initDictionary(dictionary);
    }));
  }

  public getDictionariesByFilter(
    hasFilter: boolean,
    dataSource: Observable<CustomListGenericData<DictionaryResponse>>
  ): Observable<CustomListDictionary> {
      if (hasFilter || this.attrs.needUnfilteredDictionaryToo) {
        return dataSource.pipe(switchMap((dictionary) => {
          return this.initDictionary(dictionary);
        }));
      } else if (!hasFilter && !this.attrs.needUnfilteredDictionaryToo) {
        return this.initDictionary({ data: this.emptyDictionary() });
      }

  }

  public emptyDictionary(): DictionaryResponse {
   return {
      error: { code: 0, message: 'emptyDictionary' },
      fieldErrors: [],
      items: [],
      total: 0,
    };
  }

  public getAttributeValue(componentVal: KeyValueMap | '', dictionaryAttributeName: string): unknown {
    const dictionary = this._dictionary$.getValue();
      if (componentVal) {
        const dictionaryItem = dictionary.list.find((item) => item.id === componentVal.id);
        if (dictionaryItem) {
          return dictionaryItem.originalItem.attributeValues[dictionaryAttributeName];
        }
        return undefined;
      }
  }

  protected initDictionary(reference: CustomListGenericData<DictionaryResponse>): Observable<CustomListDictionary> {
    const dictionary = this.getDictionaryFirstState();
    dictionary.loading = false;
    dictionary.paginationLoading = false;
    dictionary.data = reference.data;
    dictionary.list = this.adaptDictionaryToListItem(
      reference.data.items,
      reference.component.attrs.mappingParams,
      reference.component.attrs.mappingParams?.isRoot,
    ) as ListItem[];
    dictionary.repeatedWithNoFilters = reference?.meta?.repeatedWithNoFilters;

    this._dictionary$.next(dictionary);

    return of(dictionary);
  }

  protected getDictionaryFirstState(): CustomListDictionary {
    return {
      loading: true,
      loadError: false,
      loadEnd: false,
      paginationLoading: true,
      page: 0,
      data: {} as DictionaryResponse,
      list: [],
      origin: {} as CustomComponent,
      selectedItem: {} as DictionaryItem,
    };
  }

  protected adaptDictionaryToListItem(
    items: (DictionaryItem | KeyValueMap)[],
    mappingParams: { idPath: string; textPath: string } = { idPath: '', textPath: '' },
    isRoot?: boolean,
  ): ListElement[] {
    return items.map((item) => ({
      originalItem: item,
      id:
        (isRoot ? get(item, mappingParams.idPath, undefined) : item[mappingParams.idPath]) ||
        item.value,
      text: `${
        (isRoot ? get(item, mappingParams.textPath, undefined) : item[mappingParams.textPath]) ||
        item.title
      }`,
    }));
  }

}
