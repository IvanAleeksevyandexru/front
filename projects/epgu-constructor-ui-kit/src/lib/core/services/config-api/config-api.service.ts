import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { Config } from '../config/config.types';

@Injectable()
export class ConfigApiService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  public getFormPlayerConfig(): Observable<Config> {
    const path = `${this.configService.configApiUrl}/pgu-service-config/config/${this.configService.configId}`;
    return this.http.get<Config>(path);
  }
}
