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

  userId = '1000299353';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTczMDAzMTAsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiMmZhN2VkMDlkMDY5MjZkZWZkNzY4YWIxNjZmY2I4YzA2YjMyZjdiMTI1MDkzNWJiNzk1YjZmNmRiYzRiN2Q0NiIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk3Mzg2NzEwLCJpYXQiOjE1OTczMDAzMTAsImNsaWVudF9pZCI6IlBHVSJ9.qNJYDjnYZdrMRHDFzoCuMp0y6hGtUxU1jfc-I34NSVlZzkMGO_jxmmkOIleTPEzYgiqwXnfPQlfvCSDPPLczl3WklIJX6MRN9b0Su0HbGb0gBvDvqzy1g-paSfoXJwiWUuGtvtzWXvJORWMvOTDvUne5wSc07tVDwSI55Fpm4pqo0m7OrnDeyEkodnFZt42eHfewORLpjw-KXvLCwUPy5b7UpsILnYZ9kLRbQjDfciFUMBArdsSYObIIL1UBY4XtcBm2KXDenfmf10_GW7fVR9_kfoajJLQa1pDd-xYo637w2hg4zVocyKmpWvdfaezms4bp4-iejwkiFIye-PlIsQ';

  constructor(
    private http: HttpClient,
    private cnstrctrConfigSrv: ConstructorConfigService
  ) {
    this.apiUrl = cnstrctrConfigSrv.config.apiUrl;
    this.serviceId = cnstrctrConfigSrv.config.serviceId;
    this.dictionaryUrl = cnstrctrConfigSrv.config.dictionaryUrl;
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
}
