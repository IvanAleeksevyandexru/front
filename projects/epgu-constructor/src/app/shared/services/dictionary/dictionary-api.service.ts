import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DadataNormalizeResponse,
  DadataSuggestionsResponse,
  DictionaryResponse
} from './dictionary-api.types';
import { ConfigService } from '../../../core/services/config/config.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, delayWhen, filter, finalize, tap } from 'rxjs/operators';
import { DictionaryOptions } from 'epgu-constructor-types';
import { DictionaryUrlTypes } from '../../../component/custom-screen/components-list.types';

@Injectable()
export class DictionaryApiService {

  private dictionaryUrlMap = {
    [DictionaryUrlTypes.dictionary]: (): string => this.config.dictionaryUrl,
    [DictionaryUrlTypes.nsiSuggest]: (): string => this.config.nsiSuggestDictionaryUrl,
  };

  private dictionaryCache: Record<string, DictionaryResponse> = {};
  private processStatus: BehaviorSubject<Record<string, true>> = new BehaviorSubject<
    Record<string, true>
    >({});

  constructor(private http: HttpClient, private config: ConfigService) {}

  /**
   * Возвращает данные справочника
   * @param dictionaryName - название справочника
   * @param options - опции для получения данных
   */
  public getDictionary(
    dictionaryName: string,
    options: DictionaryOptions = {},
    dictionaryUrlType: DictionaryUrlTypes = DictionaryUrlTypes.dictionary
  ): Observable<DictionaryResponse> {
    const path = `${this.dictionaryUrlMap[dictionaryUrlType]()}/${dictionaryName}`;
    const cacheId = dictionaryName + JSON.stringify(options);

    // TODO: Вынести кеш логику в кеш сервис
    return of(cacheId).pipe(
      delayWhen(() => this.processStatus.pipe(filter((v) => !v[cacheId]))),
      concatMap((id) => {
        if (this.dictionaryCache[id]) {
          return of(this.dictionaryCache[id]);
        } else {
          const status = this.processStatus.getValue();
          status[id] = true;
          this.processStatus.next(status);

          return this.post<DictionaryResponse>(path, options).pipe(
            tap((response) => {
              this.dictionaryCache[id] = response;
            }),
            finalize(() => {
              const status = this.processStatus.getValue();
              delete status[id];
              this.processStatus.next(status);
            })
          );
        }
      }),
    );
  }

  public getMvdDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('mvd') ? `${this.config.mockUrl}/nsi/v1/dictionary` : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post<DictionaryResponse>(path, options);
  }

  public getSelectMapDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('selectMap') ? `${this.config.mockUrl}/nsi/v1/dictionary` : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post<DictionaryResponse>(path, options);
  }

  public getDadataSuggestions(qString: string, params?: { [key: string]: string }): Observable<DadataSuggestionsResponse> {
    const path = `${this.config.externalApiUrl}/dadata/suggestions`;
    return this.http.get<DadataSuggestionsResponse>(path, {
      params: {
        q: qString,
        ...params,
      }
    });
  }

  public getDadataNormalize(qString: string): Observable<DadataNormalizeResponse> {
    const path = `${this.config.externalApiUrl}/dadata/normalize`;
    return this.http.get<DadataNormalizeResponse>(path, {
      params: {
        q: qString,
      }
    });
  }

  private post<T>(path: string, options: DictionaryOptions): Observable<T> {
    return this.http.post<T>(
      path,
      {
        filter: options.filter,
        treeFiltering: options.treeFiltering || 'ONELEVEL',
        pageNum: options.pageNum || 1,
        pageSize: options.pageSize || '10000',
        parentRefItemValue: options.parentRefItemValue || '',
        selectAttributes: options.selectAttributes || ['*'],
        tx: options.tx || '',
      },
      {
        withCredentials: true,
      },
    );
  }
}
