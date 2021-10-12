import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DadataNormalizeResponse,
  DadataSuggestionsResponse,
  DictionaryResponse,
} from './dictionary-api.types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, delayWhen, filter, finalize, tap } from 'rxjs/operators';
import {
  DictionaryOptions,
  AdditionalRequestParam,
  DictionaryUrlTypes,
} from '@epgu/epgu-constructor-types';

@Injectable()
export class DictionaryApiService {
  private dictionaryUrlMap = {
    [DictionaryUrlTypes.dictionary]: (): string => this.config.dictionaryUrl,
    [DictionaryUrlTypes.nsiSuggest]: (): string => this.config.nsiSuggestDictionaryUrl,
    [DictionaryUrlTypes.lkApi]: (): string => this.config.lkApi,
    [DictionaryUrlTypes.childrenClubsApi]: (): string => this.config.childrenClubsApi,
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
    dictionaryUrlType: DictionaryUrlTypes = DictionaryUrlTypes.dictionary,
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
              if (!this.hasDictionaryResponseError(response)) {
                this.dictionaryCache[id] = response;
              }
            }),
            finalize(() => {
              const status = this.processStatus.getValue();
              delete status[id];
              this.processStatus.next(status);
            }),
          );
        }
      }),
    );
  }

  public getMvdDictionary(
    dictionaryName: string,
    options: DictionaryOptions = {},
  ): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('mvd')
      ? `${this.config.mockUrl}/nsi/v1/dictionary`
      : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post<DictionaryResponse>(path, options);
  }

  public getSelectMapDictionary(
    dictionaryName: string,
    options: DictionaryOptions = {},
  ): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('selectMap')
      ? `${this.config.mockUrl}/nsi/v1/dictionary`
      : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post<DictionaryResponse>(path, options);
  }

  public getDadataSuggestions(
    qString: string,
    params?: { [key: string]: string },
  ): Observable<DadataSuggestionsResponse> {
    const path = `${this.config.externalApiUrl}/dadata/suggestions`;
    return this.http.get<DadataSuggestionsResponse>(path, {
      params: {
        q: qString,
        ...params,
      },
    });
  }

  public getDadataNormalize(qString: string): Observable<DadataNormalizeResponse> {
    const path = `${this.config.externalApiUrl}/dadata/normalize`;
    return this.http.get<DadataNormalizeResponse>(path, {
      params: {
        q: qString,
      },
    });
  }

  private hasDictionaryResponseError(response: DictionaryResponse): boolean {
    const error = response.error;
    if (!error) {
      return false;
    }
    const codeCheck = error.code && error.code !== 0;
    const errorCodeCheck = error.errorCode && error.code !== 0;
    const errorDetailMessageCheck =
      error.errorDetail?.errorMessage &&
      error.errorDetail.errorMessage.toLowerCase() !== 'operation completed';
    return !!(codeCheck || errorCodeCheck || errorDetailMessageCheck);
  }

  private post<T>(path: string, options: DictionaryOptions): Observable<T> {
    const excludedParams = options?.excludedParams;
    const additionalParams = options?.additionalParams;
    const payload = {
      filter: options.filter,
      treeFiltering: options.treeFiltering || 'ONELEVEL',
      pageNum: options.pageNum || 1,
      pageSize: options.pageSize || '10000',
      parentRefItemValue: options.parentRefItemValue || '',
      selectAttributes: options.selectAttributes || ['*'],
      tx: options.tx || '',
    };

    if (excludedParams && Array.isArray(excludedParams)) {
      excludedParams.forEach((param: string) => {
        delete payload[param];
      });
    }

    if (additionalParams && Array.isArray(additionalParams)) {
      additionalParams.forEach((param: AdditionalRequestParam) => {
        payload[param.name] = param.value;
      });
    }

    return this.http.post<T>(path, payload, {
      withCredentials: true,
    });
  }
}
