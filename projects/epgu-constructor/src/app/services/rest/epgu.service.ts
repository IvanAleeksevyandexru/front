import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EgpuResponseInterface} from '../../../interfaces/epgu.service.interface';
import {DictionaryOptionsInterface, DictionaryResponse} from '../../../interfaces/dictionary-options.interface';
import {ConstructorService} from '../config/constructor.service';

@Injectable({
  providedIn: 'root'
})
export class EpguService {

  constructor(
    private http: HttpClient,
    private constructorService: ConstructorService
  ) {
  }

  public getData() {
    const path = `${this.constructorService.config.apiUrl}/getService/${this.constructorService.config.serviceId}`;
    return this.http.get<EgpuResponseInterface>(path, {
      withCredentials: false
    });
  }

  public setData(data) {
    const path = `${this.constructorService.config.apiUrl}/service/${this.constructorService.config.serviceId}/scenario/getNextStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      userId: '1000299353',
      // eslint-disable-next-line max-len
      token: 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTcyMzMxNTIsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiZDQzNGRjNTA4MTAxNDQwOTQ1YWUxZDBkZGJhOWQ5N2UwYWQ0NzIxYmFiNWMzNjFhOGI1YjdmZmJiNTE3ODdlYSIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk3MzE5NTUyLCJpYXQiOjE1OTcyMzMxNTIsImNsaWVudF9pZCI6IlBHVSJ9.jORLeTO95DQGm7zs5Hpq65fkZzC6Zjdg6n4LiIQXEwUdEYp54fr8w6tIkZAUYsdZ-GL_y684JMuprlxRJUzZvQJpXdwJCud__Pi6gCAZD04wkUpmr_YtQNthWnevK0fBXgOvLpA9eDIThf6zjDO6VIw3_RM2WdJw-aEHXp2wESXgLGgxqJT13k6uLoNc3u0WAXJkTXEmOVMhvoOSBFThVrKNinYSB8pGLe41xFPPx3IYoR8LV3zmgmb2s0zzvrzmjSHYdV1tJTmTkPhf2ud77CpjESWxXzD-e5wKz67eW2ZR118hKaZ5BF1zZsdZHVM68LMxNO9_zeWoX531_Y2ekA'
    }, {
      withCredentials: false
    });
  }

  getDictionary(dictionaryName: string, options: DictionaryOptionsInterface = {}) {
    const path = `${this.constructorService.config.dictionaryUrl}/${dictionaryName}`;
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
