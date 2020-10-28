import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryOptions, DictionaryResponse } from './dictionary-api.types';
import { ConfigService } from '../../../config/config.service';
import { Observable } from 'rxjs';
import { DadataNormalizeAnswer, DadataSuggestionsAnswer } from '../dadata-api/dadata-api.types';

@Injectable()
export class DictionaryApiService {

  constructor(private http: HttpClient, private config: ConfigService) {}

  /**
   * Возвращает данные справочника
   * @param dictionaryName - название справочника
   * @param options - опции для получения данных
   */
  getDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const path = `${this.config.dictionaryUrl}/${dictionaryName}`;
    return this.post(path, options);
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

  private post(path: string, options): Observable<DictionaryResponse> {
    return this.http.post<DictionaryResponse>(path, {
      filter: options.filter,
      treeFiltering: options.treeFiltering || 'ONELEVEL',
      pageNum: options.pageNum || 1,
      pageSize: options.pageSize || '1000',
      parentRefItemValue: options.parentRefItemValue || '',
      selectAttributes: options.selectAttributes || ['*'],
      tx: options.tx || '',
      // 2e641f4f-bc6a-11ea-b438-001a4a1660a6
      withCredentials: false
    });
  }

  public getDadataSuggestions(qString: string, params?: { [key: string]: string }): Observable<DadataSuggestionsAnswer> {
    const path = `${this.config.externalApiUrl}/dadata/suggestions`;
    return this.http.get<any>(path, {
      params: {
        q: qString,
        ...params,
      }
    });
  }

  public getDadataNormalize(qString: string): Observable<DadataNormalizeAnswer> {
    const path = `${this.config.externalApiUrl}/dadata/normalize`;
    return this.http.get<any>(path, {
      params: {
        q: qString,
      }
    });
  }
}
