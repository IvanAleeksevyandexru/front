import DictionarySharedAttrs from './DictionarySharedAttrs';
import BaseModel from './BaseModel';
import {
  CustomComponentAttr,
  CustomComponentDropDownItem,
  CustomComponentDropDownItemList,
} from '../components-list.types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CachedAnswersDto } from '@epgu/epgu-constructor-types';
import { ListItem } from '@epgu/ui/models/dropdown';
import { AbstractControl } from '@angular/forms';
import { isUndefined } from 'lodash';

export default class DropDownLikeModel extends BaseModel<DictionarySharedAttrs> {
  protected _dropDown$: BehaviorSubject<Partial<ListItem>[]> = new BehaviorSubject<Partial<ListItem>[]>([]);

  get dropDown$(): Observable<Partial<ListItem>[]> {
    return this._dropDown$.asObservable();
  }

  public get isResultEmpty(): boolean {
    return isUndefined(this._dropDown$.getValue()?.length)
      ? false
      : this._dropDown$.getValue()?.length === 0;
  }

  getAttrs(attrs: CustomComponentAttr): DictionarySharedAttrs {
    return new DictionarySharedAttrs(attrs);
  }

  loadReferenceData$(cachedAnswers: CachedAnswersDto): Observable<Partial<ListItem>[]> {
    if (this.attrs.isLoadingNeeded()) {
      const dataStructure = this.attrs.add ?
        this.loadCycledDropdown(this.attrs.add.component, this.attrs.add.caption, cachedAnswers) :
        this.adaptDropdown(this.attrs.dictionaryList);
      this._dropDown$.next(dataStructure);
      return of (dataStructure);
    }
  }

  patchControlValue(control: AbstractControl, _ ): boolean {
    if (!this.value && this.attrs.defaultIndex !== undefined) {
      const value = this._dropDown$.getValue()[this.attrs.defaultIndex];
      control.get('value').patchValue(value);
      return true;
    }
  }

  protected loadCycledDropdown(
    component: string,
    caption: string[],
    cachedAnswers: CachedAnswersDto,
  ): Partial<ListItem>[] {
    const items = cachedAnswers[component];
    if (!items) {
      return [];
    }
    let result:
      | string
      | Record<string, string | boolean | number>[]
      | Record<string, string | boolean | number>;
    try {
      result = JSON.parse(items.value);
    } catch (e) {
      return [];
    }
    if (!Array.isArray(result)) {
      return [];
    }
    return (result as Record<string, string | boolean | number>[]).map((answer) => {
      const text = caption
        .reduce((acc, value) => {
          acc.push(answer[value]);
          return acc;
        }, [])
        .join(' ');
      return {
        text,
        id: JSON.stringify(answer),
        originalItem: answer,
      };
    });
  }

  protected adaptDropdown(items: CustomComponentDropDownItemList): Partial<ListItem>[] {
    return items && items.map((item: CustomComponentDropDownItem, index: number) => {
      const itemText = item.label || item.title;
      const itemCode = item.code || item?.value || `${itemText}-${index}`;
      return {
        id: itemCode,
        text: `${itemText}`,
        unselectable: !!item.disable,
        originalItem: item,
        compare: (): boolean => false,
      };
    });
  }

}
