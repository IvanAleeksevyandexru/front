import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EgpuResponseInterface} from '../app/interfaces/epgu.service.interface';
import {environment} from '../environments/environment';
import {DictionaryOptionsInterface} from '../app/interfaces/dictionary-options.interface';

@Injectable({
  providedIn: 'root'
})
export class EpguService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getData(): Observable<any> {
    // const path = `${environment.apiUrl}/getService`;
    const path = `${environment.apiUrl}/getService/a1`;
    return this.http.get<EgpuResponseInterface>(path, {
      withCredentials: false
    });
  }

  public setData(data): any {
    // const path = `${environment.apiUrl}/scenario/getNextStep`;
    const path = `${environment.apiUrl}/service/a1/scenario/getNextStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      // "userId": "1000299353",
      // "token": "eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTYyNzk0MTEsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiMjc4YTI3MTNjNTMxNzcxZjU0Yjc0NzhlZmE4YjU0YWNlMjU5YWUzMDhjYzIzNTZjODVkZjg4ODgyMDk3MjJkYyIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk2MzY1ODExLCJpYXQiOjE1OTYyNzk0MTEsImNsaWVudF9pZCI6IlBHVSJ9.YwfV8_VjX1FO_TXqhrhnRhQuP6OFyajxsuLJDWTBrNivVx09aqwIbQoh93HXAJFhjFt-4SfepkZNfvIGihIOq94o1vy262W1rYb8LxSkXih-yv1Dl_epxmEUCNaT9F_eoAIF9_g48wcjI-0L-5wMBtAyICLu_sEWBqOhhLPoLQBHUZalFeSbDtxOQTyGKOQOsQwj1qBns_8u9QCQF5qDaDXbrP2wgqOefXaH43ECz2C3elVpsy6YUqx5j5dw31sw-lLYC788kMmDFtJ1aYT7fysLIHBZN-tM1-y5Vpan7Sw8g7yhExT5UhEyZVz1aed0H9NKiM2b8BW0tckfvtmTpA",
    }, {
      withCredentials: false
    });
  }

  getDictionary(dictionaryName: string, options: DictionaryOptionsInterface = {}) {
    const path = `${environment.dictionaryUrl}/${dictionaryName}`;
    return this.http.post<EgpuResponseInterface>(path, {
      "treeFiltering": options.treeFiltering || "ONELEVEL",
      "pageNum": options.pageNum || 1,
      "pageSize": options.pageSize || '150',
      "parentRefItemValue": options.parentRefItemValue || "",
      "selectAttributes": options.selectAttributes || ["*"],
      "tx": options.tx || "2e641f4f-bc6a-11ea-b438-001a4a1660a6",
      withCredentials: false
    })
  }
}
