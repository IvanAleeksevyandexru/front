import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryOptionsInterface, DictionaryResponse } from '../../../interfaces/dictionary-options.interface';
import { EgpuResponseInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorConfigService } from '../config/constructor-config.service';

@Injectable()
export class RestService {
  apiUrl: string;
  serviceId: string;
  dictionaryUrl: string;

  userId = '1000415878';
  // eslint-disable-next-line max-len
  token = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTc4MzU3NjYsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9pbmY_b2lkPTEwMDA0MTU4NzgmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3Jfc2VjP21vZGU9dyZvaWQ9MTAwMDQxNTg3OCBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3RybT9vaWQ9MTAwMDQxNTg3OCZtb2RlPXciLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiN2Q5NDMwNWYyNWIyNjMxNjljYzc3Mjc0YzMyNjIyNzU4Y2IwZjBmYmZkOTA3ODFjZjY4NDgwY2E5MDM3M2Y2NyIsInVybjplc2lhOnNial9pZCI6MTAwMDQxNTg3OCwiZXhwIjoxNTk3OTIyMTY2LCJpYXQiOjE1OTc4MzU3NjYsImNsaWVudF9pZCI6IlBHVSJ9.JQAKGLO1YeDHSiX9q1hGxLxvd4j6Uv4CGbZzFwzbZc7R2sa-PHrIH7RFSjmw2d_j6f-k6efcZCRhvj0Dfberhw0LJQS-dOMpok0dBDmmhSOVHKnbIJL8m4LVNcVR52B_4s3bOt0PisHJIIDRlOqQIYapFH2nOI_FR4Xyg7JX4mBc6d4zCcdassdxBKE6ZdGaHi9Z3tw-wJvZPCJHDvFh82VU8FPLAE4ALEJY2uHZUwDwhzgQ7Znw8wgoDeDHeSt6CzFoVeKq9QZzgUDInDrBkurZavkWn7IEeT5Uvv2Ao_5zBbqCuznczNPrzkTM7UxhVN8d0TdCeoiGlGsH0fOIug';

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
