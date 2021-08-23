import { ListElement } from '@epgu/epgu-lib';
import {
  CustomComponent,
  CustomComponentAttr,
  CustomListDictionaries,
  CustomListDictionary,
  CustomListGenericData,
  CustomListReferenceData,
  CustomScreenComponentTypes, MappingParamsDto,
} from '../../../component/custom-screen/components-list.types';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
// eslint-disable-next-line max-len
import { ComponentRestUpdates } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.interface';
// eslint-disable-next-line max-len
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { isUndefined, get } from 'lodash';
import {
  KeyValueMap,
  CustomComponentRefRelation,
  RestAttrsDto,
} from '@epgu/epgu-constructor-types';
import { getDictKeyByComp } from '../dictionary/dictionary-helper';
import { DictionaryItem, DictionaryResponse } from '../dictionary/dictionary-api.types';
import { RestService } from '../rest/rest.service';
import { HttpResponse } from '@angular/common/http';
import { InterpolationService } from '../interpolation/interpolation.service';

@Injectable()
export class RestToolsService {
  private _dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  public get dictionaries$(): BehaviorSubject<CustomListDictionaries> {
    return this._dictionaries$;
  }

  public get dictionaries(): CustomListDictionaries {
    return this._dictionaries$.getValue();
  }

  constructor(
    private restService: RestService,
    private componentsListRelationsService: ComponentsListRelationsService,
    private interpolationService: InterpolationService,
  ) {}

  public watchForUpdates(components: CustomComponent[]): Observable<CustomListReferenceData[]> {
    return this.componentsListRelationsService.restUpdates$.pipe(
      switchMap((updates: ComponentRestUpdates) => {
        const filteredComponents = components
          .filter(component => !!updates[component.id] || component?.attrs?.needUnfilteredDictionaryToo)
          .map(component => updates[component.id] ? {
            ...component,
            attrs: {
              ...component.attrs,
              ...this.interpolationService.interpolateObject(updates[component.id].rest, updates[component.id].value)
            },
          }: component);

        return this.loadReferenceData$(filteredComponents);
      }),
    );
  }

  public loadReferenceData$(components: CustomComponent[]): Observable<CustomListReferenceData[]> {
    const data: Observable<CustomListReferenceData>[] = [];

    components
      .filter((component: CustomComponent) => this.isLoadingNeeded(component.attrs))
      .forEach((component: CustomComponent) => {
        if (this.isDictionaryLike(component.type)) {
          const request: RestAttrsDto = {
            ...component.attrs,
            url: component.attrs.url + component.attrs.path,
          } as RestAttrsDto;

          data.push(this.getDictionariesByRest$(component, request));
        }
      });

    return forkJoin(data).pipe(
      tap((reference: CustomListReferenceData[]) => this.initDataAfterLoading(reference)),
    );
  }

  public getDictionariesByRest$(
    component: CustomComponent,
    request: RestAttrsDto
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return (
      this.restService.fetch<DictionaryResponse>(request)
        .pipe(
          map((response: HttpResponse<DictionaryResponse>) => ({
            component,
            data: {
              items: response.body as unknown as DictionaryItem[],
              error : null,
              fieldErrors: [],
              total: 1,
            },
          })),
        )
    );
  }

  public initDictionary(reference: CustomListGenericData<DictionaryResponse>): void {
    const dictionaries = this.dictionaries;
    const id = getDictKeyByComp(reference.component);

    dictionaries[id] = this.getDictionaryFirstState();
    dictionaries[id].loading = false;
    dictionaries[id].paginationLoading = false;
    dictionaries[id].data = reference.data;
    dictionaries[id].origin = reference.component;
    dictionaries[id].list = this.adaptDictionaryToListItem(
      reference.data.items,
      reference.component.attrs.mappingParams,
      reference.component.attrs.mappingParams?.isRoot,
    );
    dictionaries[id].repeatedWithNoFilters = reference?.meta?.repeatedWithNoFilters;

    this.dictionaries$.next(dictionaries);
  }

  /**
   * Мапим словарь в ListItem для компонента EPGU отвечающий за список
   * @param items массив элементов словаря
   */
  public adaptDictionaryToListItem(
    items: (DictionaryItem | KeyValueMap)[],
    mappingParams: MappingParamsDto = { idPath: '', textPath: '' },
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

  public getDictionaryFirstState(): CustomListDictionary {
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

  public isDictionaryLike(type: CustomScreenComponentTypes): boolean {
    return [
      CustomScreenComponentTypes.RestLookup
    ].includes(type);
  }

  public isResultEmpty(component: CustomComponent): boolean {
    if (this.isDictionaryLike(component.type)) {
      const id = getDictKeyByComp(component);
      return isUndefined(this.dictionaries[id]?.list?.length)
        ? false
        : this.dictionaries[id]?.list?.length === 0;
    }

    throw new Error('Incorrect usage of filterOn ref');
  }

  private initDataAfterLoading(references: CustomListReferenceData[]): void {
    references.forEach((reference: CustomListReferenceData) => {
      if (this.isDictionaryLike(reference.component.type)) {
        this.initDictionary(reference as CustomListGenericData<DictionaryResponse>);
      }
    });
  }

  /**
   * Проверяет необходимость начальной загрузки справочника
   * @param compAttrs атрибуты компонента
   * @returns
   */
  private isLoadingNeeded(compAttrs: CustomComponentAttr): boolean {
    if (compAttrs.searchProvider) {
      return false;
    }

    if (compAttrs.url && compAttrs.path) {
      return true;
    }

    if (!Array.isArray(compAttrs.ref)) {
      return true;
    }

    const hasFilterOnRef = compAttrs.ref.some(
      (reference) => reference.relation === CustomComponentRefRelation.updateRestLookupOn,
    );
    return !hasFilterOnRef || compAttrs.needUnfilteredDictionaryToo;
  }
}