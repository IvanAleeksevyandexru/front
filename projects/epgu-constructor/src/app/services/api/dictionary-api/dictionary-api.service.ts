import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryOptions, DictionaryResponse } from './dictionary-api.types';
import { ConfigService } from '../../../config/config.service';
import { Observable } from 'rxjs';

@Injectable()
export class DictionaryApiService {
  dictionaryUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
    this.dictionaryUrl = configService.config.dictionaryUrl;
  }

  /**
   * Возвращает данные справочника
   * @param dictionaryName - название справочника
   * @param options - опции для получения данных
   */
  getDictionary(dictionaryName: string, options: DictionaryOptions = {}): Observable<DictionaryResponse> {
    const path = `${this.dictionaryUrl}/${dictionaryName}`;
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
}
