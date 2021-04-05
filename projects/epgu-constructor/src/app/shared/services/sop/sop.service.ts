import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SopItem,
  SopMapOptions,
  SopOptions,
  SopOptionsFilter,
  SopProjectionMode,
  SopRequestFilter,
  SopRequestOptions,
  SopResponse,
} from './sop.types';
import { ConfigService } from '../../../core/services/config/config.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, delayWhen, filter, finalize, map, tap } from 'rxjs/operators';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { ComponentValue, DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { IdictionaryFilter } from '../../../component/unique-screen/components/select-map-object/select-map-object.interface';
import {
  DictionaryConditions,
  DictionaryFilters,
  DictionarySubFilter,
  DictionaryValueTypes,
} from '../dictionary/dictionary-api.types';
import { ScreenStore } from '../../../screen/screen.types';

@Injectable()
export class SopService {
  private dictionaryCache: Record<string, SopResponse> = {};
  private componentValue: ComponentValue = {};
  private screenStore: ScreenStore = {};
  private processStatus: BehaviorSubject<Record<string, true>> = new BehaviorSubject<
    Record<string, true>
  >({});

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private dictionaryToolsService: DictionaryToolsService,
  ) {}

  public getDictionary(
    options: SopOptions,
    value: ComponentValue = {},
    store: ScreenStore = {},
  ): Observable<SopResponse> {
    const path = `${this.config.sopApiUrl}`;
    const cacheId = JSON.stringify(options);

    this.initValueAndStore(value, store);

    return of(cacheId).pipe(
      delayWhen(() => this.processStatus.pipe(filter((v) => !v[cacheId]))),
      concatMap((id) => this.getFromCacheOrFetch(id, path, options)),
    );
  }

  public adaptResponseToListItem(
    items: Array<SopItem>,
    options: SopMapOptions = {},
  ): Array<ListElement> {
    return items.map((item: SopItem) => ({
      originalItem: item,
      id: (options.key ? item[options.key] : item.value) as string,
      text: (options.value ? item[options.value] : item.title) as string,
    }));
  }

  private initValueAndStore(value: ComponentValue, screenStore: ScreenStore): void {
    this.componentValue = value;
    this.screenStore = screenStore;
  }

  private getFromCacheOrFetch(
    id: string,
    path: string,
    options: SopOptions,
  ): Observable<SopResponse> {
    if (this.dictionaryCache[id]) {
      return of(this.dictionaryCache[id]);
    }

    const status = this.processStatus.getValue();
    status[id] = true;
    this.processStatus.next(status);

    return this.post<SopResponse>(path, options).pipe(
      map((response) => ({
        ...response,
        items: response?.data ? this.adaptResponseToListItem(response.data, options) : [],
      })),
      tap((response) => {
        this.dictionaryCache[id] = response;
      }),
      finalize(() => {
        const status = this.processStatus.getValue();
        delete status[id];
        this.processStatus.next(status);
      }),
    );
  }

  private sopFilterToDictionaryFilter(filter: SopOptionsFilter): IdictionaryFilter {
    return {
      attributeName: filter.columnUid,
      condition: DictionaryConditions.EQUALS,
      value:
        filter.valueType === DictionaryValueTypes.value
          ? JSON.stringify({ asString: filter.value })
          : filter.value,
      valueType: filter.valueType,
    };
  }

  private dictionaryFilterToSopFilter(
    subFilter: DictionarySubFilter | DictionaryFilters['filter'],
  ): SopRequestFilter {
    return {
      columnUid: subFilter?.simple.attributeName,
      value: subFilter?.simple.value.asString,
    };
  }

  private getFilterOptions(options: SopOptions): Array<SopRequestFilter> | null {
    if (!Array.isArray(options.filter) || options.filter.length === 0) return null;

    const dictionaryFilters = options.filter.map(this.sopFilterToDictionaryFilter);

    const filtersWithValue: DictionaryFilters = this.dictionaryToolsService.getFilterOptions(
      this.componentValue,
      this.screenStore,
      dictionaryFilters,
    );

    if (filtersWithValue?.filter?.simple) {
      return [this.dictionaryFilterToSopFilter(filtersWithValue?.filter)];
    }

    if (filtersWithValue?.filter?.union?.subs) {
      return filtersWithValue?.filter?.union.subs.map(this.dictionaryFilterToSopFilter);
    }

    throw new Error('Incorrect filter for sop');
  }

  private prepareSopRequestOptions(options: SopOptions): SopRequestOptions {
    const filters = this.getFilterOptions(options);

    return {
      levenshtein: 2,
      limit: {
        pageNumber: options.pageNum || 1,
        pageSize: options.pageSize || 100,
      },
      projection: {
        columnUids: options.columnUids || [],
        mode: SopProjectionMode.INCLUDE,
      },
      sourceUid: options.sourceUid,
      ...(filters ? { filter: { filters }} : {}),
      dictionarySopTest: options.dictionarySopTest || false,
    };
  }

  private post<T>(path: string, options: SopOptions): Observable<T> {
    return this.http.post<T>(path, this.prepareSopRequestOptions(options), {
      headers: {
        apiKey: this.config.sopApiKey,
      },
      withCredentials: true,
    });
  }
}
