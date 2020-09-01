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

  userId = '1000298933';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTg1MTQ1ODksInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9pbmY_b2lkPTEwMDAyOTg5MzMmbW9kZT13IiwiaXNzIjoiaHR0cDpcL1wvZXNpYS1wb3J0YWwxLnRlc3QuZ29zdXNsdWdpLnJ1XC8iLCJ1cm46ZXNpYTpzaWQiOiJhNWI0NGUwZjcyMDY3ZWM3MmZkZWJhM2Q4ZmMxMzU0NzgzZGZlZWU4MTUzM2RhNGJjY2Y1ZTEzZmRiNDkwMjExIiwidXJuOmVzaWE6c2JqX2lkIjoxMDAwMjk4OTMzLCJleHAiOjE1OTg2MDA5ODksImlhdCI6MTU5ODUxNDU4OSwiY2xpZW50X2lkIjoiUEdVIn0.qFa0xAt6GJ6VmVuYO7BQ9g6DDGlg1UdwBK3owdVhjghl8wjw4BRHd96eaMbOy53jWpFyFLZRspey1qyheA91sqFvkgpL2VEelAqYfSmL2Zb3oBxSPlkTtwt4mZsoBj6FLKgf387XBu8t0XtoryDWr7AA7_nR7qJ5uxtm8BrmdjI9tjojQz01FMCE71VV9iwoZgFrf98rOm6W440sGbAlR-VbATCB8yhezyjNfmG_RAXA36_CQjSyCmyMhd_FwXMR6lxeWIqH4LGgRd9s-eaGy-BLzjvWGB-zfRE-Ut6Rc_iQX_pj09rr-5mKxiYjsI-jieVuY_afraygJI_sE0mOHQ';
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
