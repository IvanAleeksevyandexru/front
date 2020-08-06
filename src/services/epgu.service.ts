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

  public getData(): Observable<any> {
    const path = `${environment.apiUrl}/api/getService/${environment.serviceId}`;
    return this.http.get<EgpuResponseInterface>(path, {
      withCredentials: false
    });
  }

  public setData(data): any {
    const path = `${environment.apiUrl}/api/service/${environment.serviceId}/scenario/getNextStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      userId: '1000299353',
      // eslint-disable-next-line max-len
      token: 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTY2MTIzMjgsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiYzRjYjZjMWVjZjU2ZDRiMDViNjgwNDBhNDQwZTFmZTA0Zjk4MmJlNDEyN2E5YzI0NDMwOWQ0YzUxN2MxZWFjYyIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk2Njk4NzI4LCJpYXQiOjE1OTY2MTIzMjgsImNsaWVudF9pZCI6IlBHVSJ9.w2GriQWFmbpELExmk0Xlty4H_3aP87ssxN0KH_0Y6EEfkEIUZ3pz9hMNDQyZrXUykOAGGqVA0GyG4I7Rks9GM9dJSIuMQp1XCpYCQ_2AG8LkZ34D34Zgj6g4_GThbhxOSZMmCg955mXtP8oHxHwuFCnfoJHHeM81bpqeg1J6myzob7j_wXA0FSaS6Zaf9Yx8J0GgAAVsfC3_B24yWwjZL49PV842GfvwS_bu4jm8JO2gPXU6oPgXNapRAcUyNmYciq2AJMWZ6LNxWMo5pHS-WMP2MiGH_KqO6PiLLtu5yXrr9ucV2y_lasnc6EEJdvYNCR-1vIr4Mgof6ng9NhwcsA',
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
