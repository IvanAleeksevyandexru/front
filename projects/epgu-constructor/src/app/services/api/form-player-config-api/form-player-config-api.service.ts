import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../../config/config.types';
import { LoadService } from 'epgu-lib';
import { apiUrlDefault } from '../form-player-api/form-player-api.service';

@Injectable()
export class FormPlayerConfigApiService {
  private apiUrl = apiUrlDefault;

  constructor(
    private http: HttpClient,
    private loadService: LoadService
  ) {
    this.loadService.loaded.subscribe(() => {
      const coreApiUrl = this.loadService.config.newSfApiUrl;
      this.apiUrl = coreApiUrl ?? apiUrlDefault;
    });
  }

  public getFormPlayerConfig(): Observable<Config> {
    const path = `${this.apiUrl}/pgu-service-config/config/default-config`;
    return this.http.get<Config>(path);
  }

}
