import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryOptionsInterface, DictionaryResponse } from '../../../interfaces/dictionary-options.interface';
import { ResponseInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { MockService } from '../mock/mock.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RestService {
  apiUrl: string;
  serviceId: string;
  dictionaryUrl: string;
  externalApiUrl: string;

  userId = '1000299353';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTk0NjM3OTMsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLXBvcnRhbDEudGVzdC5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjBjYjMxMWQ1MTk3ZWQ2NWVkNzNhNTAyOGJiZjE5Y2IwMDA3N2I3YzNiMTUzMTcwMDZmYjk0YjI0ZDM5ZThkNDEiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5OTU1MDE5MywiaWF0IjoxNTk5NDYzNzkzLCJjbGllbnRfaWQiOiJQR1UifQ.1lmOTJ3SSuqAQ9qcqDLTiAbFQBIO8nKTGr26odAlcPVtIN-2YXj00Wu1Kx0Ymgth3naCDdtwKHCfq4l5hKJWazOX5bXRrR3930OC9LCNg9qtHbX9gfrg_5w3iLKlyf1H_fkV0oVROSRc95d5Tq86Bij2QPQhiEMhwmumpf9cjItEQlEBV3K5cfFbJ4oROCwpu3PxiCqqm6fORm_tB_Ogpkw_jOJ8XHeUC1TNfA65qH-VSpLxePNANSwV41k-GTvrwq1QMG6Farwz0rb8zx8qIUUNnKVk7qc5Va3fzN_eVrF0KdDxTKOOu18Ks2W6ClmtyciJhoNgrsGXumx3fMjkHw';
  currentUserId: string;
  currentUserToken: string;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private mockService: MockService,
    private cookieService: CookieService
  ) {
    this.apiUrl = constructorConfigService.config.apiUrl;
    this.serviceId = constructorConfigService.config.serviceId;
    this.dictionaryUrl = constructorConfigService.config.dictionaryUrl;
    this.externalApiUrl = constructorConfigService.config.externalApiUrl;
    // TODO: add fetch current user data for prod env
    this.currentUserId = constructorConfigService.config.isProd ? this.currentUserId : this.mockService.currentUserId;
    this.currentUserToken = constructorConfigService.config.isProd ? this.currentUserToken : this.mockService.currentUserToken;
    this.cookieService.set('u', this.currentUserId);
    this.cookieService.set('acc_t', this.currentUserToken);
  }

  public getData() {
    const path = `${this.apiUrl}/getService/${this.serviceId}`;
    return this.http.get<ResponseInterface>(path, {
      withCredentials: false
    });
  }

  public getNextStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getNextStep`;
    data.scenarioDto.userId = this.currentUserId;
    data.scenarioDto.token = this.currentUserToken;
    return this.http.post<ResponseInterface>(path, {
      ...data,

    }, {
      withCredentials: false
    });
  }

  public getPrevStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getPrevStep`;
    data.scenarioDto.userId = this.currentUserId;
    data.scenarioDto.token = this.currentUserToken;
    return this.http.post<ResponseInterface>(path, {
      ...data
    }, {
      withCredentials: false
    });
  }

  /**
   * Возвращает данные справочника
   * @param dictionaryName - название справочника
   * @param options - опции для получения данных
   */
  getDictionary(dictionaryName: string, options: DictionaryOptionsInterface = {}): Observable<DictionaryResponse> {
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

  getDadataByFias(fiasCode: string) {
    const path = `${this.externalApiUrl}dadata/${fiasCode}`;
    return this.http.get(path);
  }

}
