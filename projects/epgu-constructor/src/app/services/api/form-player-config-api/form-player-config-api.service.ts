import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../../config/config.types';
import { LoadService } from 'epgu-lib';

export const apiConfigUrlDefault = '/api';

@Injectable()
export class FormPlayerConfigApiService {
  private apiConfigUrl = apiConfigUrlDefault;

  constructor(
    private http: HttpClient,
    private loadService: LoadService
  ) {
    this.loadService.loaded.subscribe(() => {
      const coreConfigApiUrl = this.loadService.config.newSfConfigApiUrl;
      this.apiConfigUrl = coreConfigApiUrl ?? apiConfigUrlDefault;
    });
  }

  public getFormPlayerConfig(): Observable<Config> {
    const path = `${this.apiConfigUrl}/pgu-service-config/config/default-config`;
    return this.http.get<Config>(path);
  }

}
