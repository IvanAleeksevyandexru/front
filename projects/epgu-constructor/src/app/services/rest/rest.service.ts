import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EgpuResponseInterface} from '../../../interfaces/epgu.service.interface';
import {DictionaryOptionsInterface, DictionaryResponse} from '../../../interfaces/dictionary-options.interface';
import {ConstructorConfigService} from '../config/constructor-config.service';

@Injectable()
export class RestService {
  apiUrl: string;
  serviceId: string;
  dictionaryUrl: string;
  externalApiUrl: string;

  userId = '1000298933';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTc4MDA3NTEsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9pbmY_b2lkPTEwMDAyOTg5MzMmbW9kZT13IiwiaXNzIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6ImMwZTYxYmIxYWRjYzQ1NmU2ZWY4Y2RkNjkxZDA5ZGIxNzlhNzI5YjU1NTIyZWU1MTc2MjJkZTdmNjc3Yjg5NDIiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTg5MzMsImV4cCI6MTU5Nzg4NzE1MSwiaWF0IjoxNTk3ODAwNzUxLCJjbGllbnRfaWQiOiJQR1UifQ.H884KLu5xExHnSJR12WvDybONsd7s0dfpgTqcpNHk-DWK6gRpfp4bxsllv9oqdUDoANGI1JYOlK3Y6h6mu8jItg3iU-uiz-0SYZTu51x2HbzOwH7ZBs_cvrsGvQ1ffNHVeXvbfUzrZaOn3xCOSgq8fza0mnQrkcKt1eRE-wEXTB1dPFPmXOxiTFEnQKoA3whF_9B5f7jXqdTPOcJjCLPF8zJAMxJYDHwXNGkQmbl-YNGBR_XBxPEIrcaGPdHmnikCCYLHMc3Y8mszVoa7UGGoJv8LtaMd33pSRtIge_g_BMXOip0iEmTFqoaUi7YX4zkxhYfdrtt9TWSh8f7UGwewA';

  constructor(
    private http: HttpClient,
    private cnstrctrConfigSrv: ConstructorConfigService
  ) {
    this.apiUrl = cnstrctrConfigSrv.config.apiUrl;
    this.serviceId = cnstrctrConfigSrv.config.serviceId;
    this.dictionaryUrl = cnstrctrConfigSrv.config.dictionaryUrl;
    this.externalApiUrl = cnstrctrConfigSrv.config.externalApiUrl;
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
      userId: this.userId,
      token: this.token,
    }, {
      withCredentials: false
    });
  }

  public getPrevStep(data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/getPrevStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      userId: this.userId,
      token: this.token,
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
