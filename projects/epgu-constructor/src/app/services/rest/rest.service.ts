import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryOptionsInterface, DictionaryResponse } from '../../../interfaces/dictionary-options.interface';
import { EgpuResponseInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { MockService } from '../mock/mock.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class RestService {
  apiUrl: string;
  serviceId: string;
  dictionaryUrl: string;
  externalApiUrl: string;

  userId = '1000298933';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTg0NDUzNDEsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9pbmY_b2lkPTEwMDAyOTg5MzMmbW9kZT13IiwiaXNzIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjBkODBjZDI1M2UzZGY5NzEzODQ5NmY2MWMxZmU1MDc1ZDhlYjliYmY2ZTEwYmRjOWY0ZWJhNjM2Mzk1ZTM5ODAiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTg5MzMsImV4cCI6MTU5ODUzMTc0MSwiaWF0IjoxNTk4NDQ1MzQxLCJjbGllbnRfaWQiOiJQR1UifQ.bAVH8qDiVrYyjUDBgmnXWbOB2iTc4nMDspx5aU6MoTGWX561DZn7Ip-HAyMso1_XZM42V3DEuMVYrZVaItD20nVHXR_XLavdmPey_fnWKC8v7TgtY7tTQ97_Z4Ue-G3EwQkeR_gBnXNOhNfkf2rnXri6Fnn0eIXvU4V8efpvYtIezbXU6DsEJaD_avffdiumj2xMe7woEI1QdHLWO3ml5FJaBnoMdJXQhC5Iz1bHeeUJDpIAFTRDJV6VZ5swPFSAxx1Mu8zdU-j44aSVQysBEMTiCYenuFd_-gnbEn55QWVkTBszWuYWMk_Us0o_Xi32Exd3BrTmc33jKimRkieatw';
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
    return this.http.get<EgpuResponseInterface>(path, {
      withCredentials: false
    });
  }

  public getNextStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getNextStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      userId: this.currentUserId,
      token: this.currentUserToken,
    }, {
      withCredentials: false
    });
  }

  public getPrevStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getPrevStep`;
    return this.http.post<EgpuResponseInterface>(path, {
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
