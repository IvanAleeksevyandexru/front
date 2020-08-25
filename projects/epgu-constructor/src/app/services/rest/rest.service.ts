import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryOptionsInterface, DictionaryResponse } from '../../../interfaces/dictionary-options.interface';
import { ResponseInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { MockService } from '../mock/mock.service';

@Injectable()
export class RestService {
  apiUrl: string;
  serviceId: string;
  dictionaryUrl: string;
  externalApiUrl: string;

  userId = '1000299353';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTc5MDUzMjgsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiZTUwZDlmZmJlODA0YTRkZjY4NzI5Mzc1MTljMzRmNDExYzM2MzQxMzk1NGI3ZWE4MDE5ZjNjZTI3NDVhZGFiMyIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk3OTkxNzI4LCJpYXQiOjE1OTc5MDUzMjgsImNsaWVudF9pZCI6IlBHVSJ9.gPSeau7tk1hcXFg72IsIeSXSZ7NeCpB1tfW2zRACGC2ZvLUyqGoYlw72xOBStc6mbEQsrItB1GS6jrbtGYag0d9wHCtdcDMiXN0CugVzChuQthETHp2pzYFupTOKuCzgyxD0YjMCp0WlOkMgL_vgjM0vycrBSxJUBbgeiI2THSLaX0JWZouqgKuMymZdLBeI2vmeqoV-YxTlEy7FMjug02ebRmss-dWV481iIzwoBPPQkcrwkgT8TemWH8thgP9_zjAuQax92Tx6BQXzHx9fagHoilWwZh8X9Ib9qdK5Wf5_pefhIW8VjXOAcFxUvo3mYB3wjcJwo5hW8F8J9UhKZA';
  currentUserId: string;
  currentUserToken: string;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private mockService: MockService,
  ) {
    this.apiUrl = constructorConfigService.config.apiUrl;
    this.serviceId = constructorConfigService.config.serviceId;
    this.dictionaryUrl = constructorConfigService.config.dictionaryUrl;
    this.externalApiUrl = constructorConfigService.config.externalApiUrl;
    // TODO: add fetch current user data for prod env
    this.currentUserId = constructorConfigService.config.isProd ? this.currentUserId : this.mockService.currentUserId;
    this.currentUserToken = constructorConfigService.config.isProd ? this.currentUserToken : this.mockService.currentUserToken;
  }

  public getData() {
    const path = `${this.apiUrl}/getService/${this.serviceId}`;
    return this.http.get<ResponseInterface>(path, {
      withCredentials: false
    });
  }

  public getNextStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getNextStep`;
    return this.http.post<ResponseInterface>(path, {
      ...data,
      userId: this.currentUserId,
      token: this.currentUserToken,
    }, {
      withCredentials: false
    });
  }

  public getPrevStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getPrevStep`;
    return this.http.post<ResponseInterface>(path, {
      ...data,
      userId: this.currentUserId,
      token: this.currentUserToken,
    }, {
      withCredentials: false
    });
  }

  getDictionary(dictionaryName: string, options: DictionaryOptionsInterface = {}) {
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
    })
  }

  getDadataByFias(fiasCode: string) {
    const path = `${this.externalApiUrl}dadata/${fiasCode}`;
    return this.http.get(path)
  }

}
