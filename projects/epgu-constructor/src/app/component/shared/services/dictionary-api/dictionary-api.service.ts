import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DadataNormalizeAnswer,
  DadataSuggestionsAnswer,
  DictionaryOptions,
  DictionaryResponse
} from './dictionary-api.types';
import { ConfigService } from '../../../../core/services/config/config.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, delayWhen, filter, finalize, tap } from 'rxjs/operators';

@Injectable()
export class DictionaryApiService {

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
  getDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const path = `${this.config.dictionaryUrl}/${dictionaryName}`;
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

          return this.post(path, options).pipe(
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

  getMvdDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('mvd') ? `${this.config.mockUrl}/nsi/v1/dictionary` : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post(path, options);
  }

  getSelectMapDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('selectMap') ? `${this.config.mockUrl}/nsi/v1/dictionary` : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post(path, options);
  }

  public getDadataSuggestions(qString: string, params?: { [key: string]: string }): Observable<DadataSuggestionsAnswer> {
    const path = `${this.config.externalApiUrl}/dadata/suggestions`;
    return this.http.get<DadataSuggestionsAnswer>(path, {
      params: {
        q: qString,
        ...params,
      }
    });
  }

  public getDadataNormalize(qString: string): Observable<DadataNormalizeAnswer> {
    const path = `${this.config.externalApiUrl}/dadata/normalize`;
    return this.http.get<DadataNormalizeAnswer>(path, {
      params: {
        q: qString,
      }
    });
  }

  private post(path: string, options: DictionaryOptions): Observable<DictionaryResponse> {
    return this.http.post<DictionaryResponse>(
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
