import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EgpuResponseInterface} from '../../../interfaces/epgu.service.interface';
import {DictionaryOptionsInterface, DictionaryResponse} from '../../../interfaces/dictionary-options.interface';
import {ConstructorService} from '../config/constructor.service';

@Injectable({
  providedIn: 'root'
})
export class EpguService {
  userId = '1000299353';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTY3ODk1MDQsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiOWZiZTQ4MjU3MWE5N2NhNWI1ZDU2ZTFjYmExZjFlNDFlODgzZDg5NTIwYjg2Njk3OWE1NTE4NDNlMjI4NjY2NCIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk2ODc1OTA0LCJpYXQiOjE1OTY3ODk1MDQsImNsaWVudF9pZCI6IlBHVSJ9.mkaOXF-um7BXT3sRM1y--P6rWwwb_ktzgG4j7bQhWvfukfCyOf7CwvAJ0MwcWVWFTD88S3-ZcFLoj8r3tkSi6ioHgT1oBPqTNyLEe4_kuIuZweDzdBU0ReGzMQXqmy0j9r-AiKtw7xdw6FFWze7J1CoIlJrr3j74M6HiPTQQdxBq9lqu3rJJYzcBjurPa16UCy0541CBYsgzRFDXWBYikkJZZMV95Zn3yeAu17GQjjbVMxGXPIPRVVuSaR8OoIlbQIIIU0ZwTgBUsKHTGWVaZ_xQ--vLpmlL-w6OvCu8wWIxu7xgCbShSDrKGP8Syl91zuacI2usV8gLuPiMq9td_w';

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
      userId: this.userId,
      token: this.token,
    }, {
      withCredentials: false
    });
  }

  public getPrevStep(data) {
    const path = `${this.constructorService.config.apiUrl}/service/${this.constructorService.config.serviceId}/scenario/getPrevStep`;
    return this.http.post<EgpuResponseInterface>(path, {
      ...data,
      userId: this.userId,
      token: this.token,
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
