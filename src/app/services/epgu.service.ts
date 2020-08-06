import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EgpuResponseInterface} from '../app/interfaces/epgu.service.interface';
import {environment} from '../environments/environment';
import {DictionaryOptionsInterface, DictionaryResponse} from '../app/interfaces/dictionary-options.interface';

@Injectable({
  providedIn: 'root'
})
export class EpguService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getData() {
    const path = `${environment.apiUrl}/api/getService/${environment.serviceId}`;
    return this.http.get<EgpuResponseInterface>(path, {
      withCredentials: false
    });
  }

  public setData(data) {
    const path = `${environment.apiUrl}/api/service/${environment.serviceId}/scenario/getNextStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      userId: '1000299353',
      // eslint-disable-next-line max-len
      token: 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTY3MTUwMTMsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiN2FhMjc1MDNmNDU1MWFjNTM2ZGNlY2QyMzM1YTg0MTEzMjhlYzMzNWE0ZDdlODFlYjY2NjczNzVmOTExNWYxYyIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk2ODAxNDEzLCJpYXQiOjE1OTY3MTUwMTMsImNsaWVudF9pZCI6IlBHVSJ9.NIHkL9gtDhhrVkQY0MfWXEf4gCSPsjPhz5Ap9CUPVYsdGVRBmzH6mXsO5JgCQNsrPkTuvCk0yaAZpNsM6Iy0qYAn3NgmoEZg93hlsntjXV5cMvseZbWbZSA0BL1500zTEuqd7vUHg1q_cTbUgL-ZpuC8-C2Xr9AyNSnxQbGFDCZak0UVSNiqMSQ2sbZDgCutGYT7nXJ2j6_qqg40A1q6jgDM8e9vr5RM7A_C1oA0eXorE-HzXX3oGDYWtrQ6Ow9U9Ivr5I58CkaRlSzF9LUN77Y-IgxiGQ-rOYTmFNO-ItdT_KaPljbIFW_k59Gkl84B09TA__ndQn-y_sK2QNM1KA',
    }, {
      withCredentials: false
    });
  }

  getDictionary(dictionaryName: string, options: DictionaryOptionsInterface = {}) {
    const path = `${environment.dictionaryUrl}/${dictionaryName}`;
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
