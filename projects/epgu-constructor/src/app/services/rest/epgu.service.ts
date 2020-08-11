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
      token: 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTcxNDQ2NTAsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiNTRlYmFjOGJiOTk2YzE5ZmY1Y2UwY2M5MjA3NzA3OWNiYzRlNjVkN2M5NWIyNzc4Y2M5YjIwMGVmNzE3MWZhYiIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk3MjMxMDUwLCJpYXQiOjE1OTcxNDQ2NTAsImNsaWVudF9pZCI6IlBHVSJ9.frc71Bvzt3p0p267-stXo4t3g778DbTDYucOgTQUzWij4Vn2u2s27P5yXPx0EAhTKHQzKFTFrVmu8cpuOnuoRVrtn7BTolMchGaR-3vo-drqLERq33Bjez7SrzwDZM0HZKSzxTEsdPbxHKc2dk71m55YZBunaKok37y1lKk194fGNQWb0KiNMzc4N5kdw7H_J2V7V_WYQDwHm0AJP6Q5H_hA-NJkRHmTZVaXp7HgSLdGWyIkY1uyNLBdT8BIiIjvKNhk-WQCVCTEledOnlCYduyceFO12KkP2h1KxrVlQYh5ca__IrfA3cdCSqT4HiPCgyc-QmYXYdEav44ceBvV-w'
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
