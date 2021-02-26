import { Injectable } from '@angular/core';
import {
  CustomComponent,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListGenericData,
  CustomListReferenceData,
} from '../../components-list.types';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  getCustomScreenDictionaryFirstState,
  getNormalizeDataCustomScreenDictionary,
  isDropDown,
  likeDictionary,
} from '../../tools/custom-screen-tools';
import {
  DictionaryOptions,
  DictionaryResponse,
} from '../../../../services/dictionary-api/dictionary-api.types';
import { map, tap } from 'rxjs/operators';
import { DictionaryApiService } from '../../../../services/dictionary-api/dictionary-api.service';
import {
  ComponentDictionaryFilters,
  ComponentListToolsService,
} from '../component-list-tools/component-list-tools.service';
import { UtilsService as utils } from '../../../../../../core/services/utils/utils.service';
import { ListItem } from 'epgu-lib';

@Injectable()
export class ComponentListRepositoryService {
  private _dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);
  private _dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  get dropDowns$(): BehaviorSubject<CustomListDropDowns> {
    return this._dropDowns$;
  }

  get dictionaries$(): BehaviorSubject<CustomListDictionaries> {
    return this._dictionaries$;
  }

  public get dictionaries(): CustomListDictionaries {
    return this._dictionaries$.getValue();
  }

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private toolsService: ComponentListToolsService,
  ) {}

  watchForFilters$(components: Array<CustomComponent>): Observable<CustomListReferenceData[]> {
    return this.toolsService.filters$.pipe(
      switchMap((filters: ComponentDictionaryFilters) => {
        const data: Array<Observable<CustomListReferenceData>> = [];

        components.forEach((component: CustomComponent) => {
          if (filters[component.id] !== undefined && likeDictionary(component.type)) {
            const { dictionaryType, dictionaryOptions } = component.attrs;
            const options: DictionaryOptions = dictionaryOptions
              ? dictionaryOptions
              : { pageNum: 0 };

            options.filter = filters[component.id];
            data.push(this.getDictionaries$(dictionaryType, component, options));
          }
        });

        return forkJoin(data);
      }),
      tap((reference: Array<CustomListReferenceData>) => this.initDataAfterLoading(reference)),
    );
  }

  loadReferenceData$(components: Array<CustomComponent>): Observable<CustomListReferenceData[]> {
    const data: Array<Observable<CustomListReferenceData>> = [];
    components.forEach((component: CustomComponent) => {
      if (isDropDown(component.type)) {
        data.push(this.getDropDowns$(component));
      }

      if (likeDictionary(component.type)) {
        const { dictionaryType, dictionaryOptions } = component.attrs;
        const options: DictionaryOptions = dictionaryOptions ? dictionaryOptions : { pageNum: 0 };
        data.push(this.getDictionaries$(dictionaryType, component, options));
      }
    });

    return forkJoin(data).pipe(
      tap((reference: Array<CustomListReferenceData>) => this.initDataAfterLoading(reference)),
    );
  }

  getDictionaries$(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return this.dictionaryApiService.getDictionary(dictionaryType, options).pipe(
      map((dictionary: DictionaryResponse) => ({
        component,
        data: { ...dictionary },
      })),
      map((dictionary) => {
        // TODO: удалить когда будет реализована фильтрация справочника на строне RTlabs
        if (component.attrs.filter) {
          const items = dictionary.data.items.filter((data) =>
            component.attrs.filter.value.includes(data[component.attrs.filter.key]),
          );
          const data: DictionaryResponse = {
            ...dictionary.data,
            items,
          };

          return {
            component,
            data,
          };
        }

        return dictionary;
      }),
    );
  }

  getDropDowns$(
    component: CustomComponent,
  ): Observable<CustomListGenericData<Partial<ListItem>[]>> {
    return of({
      component,
      data: component.attrs?.add
        ? this.toolsService.loadCycledDropdown(component)
        : this.toolsService.adaptiveDropDown(component.attrs.dictionaryList),
    });
  }

  initDataAfterLoading(references: Array<CustomListReferenceData>): void {
    references.forEach((reference: CustomListReferenceData) => {
      if (isDropDown(reference.component.type)) {
        this.initDropDown(reference as CustomListGenericData<Partial<ListItem>[]>);
      }

      if (likeDictionary(reference.component.type)) {
        this.initDictionary(reference as CustomListGenericData<DictionaryResponse>);
      }
    });
  }

  initDictionary(reference: CustomListGenericData<DictionaryResponse>): void {
    const dictionaries = this.dictionaries;
    const id = utils.getDictKeyByComp(reference.component);

    dictionaries[id] = getCustomScreenDictionaryFirstState();
    dictionaries[id].loading = false;
    dictionaries[id].paginationLoading = false;
    dictionaries[id].data = reference.data;
    dictionaries[id].origin = reference.component;
    dictionaries[id].list = getNormalizeDataCustomScreenDictionary(
      reference.data.items,
      reference.component,
    );

    this.dictionaries$.next(dictionaries);
  }

  initDropDown(reference: CustomListGenericData<Partial<ListItem>[]>): void {
    const dropDowns = this.dropDowns$.getValue();
    dropDowns[reference.component.id] = reference.data;

    this.dropDowns$.next(dropDowns);
  }
}
