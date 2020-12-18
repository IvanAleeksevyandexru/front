import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../../core/config/config.types';
import { ConfigService } from '../../../core/config/config.service';

@Injectable()
export class FormPlayerConfigApiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  public getFormPlayerConfig(): Observable<Config> {
    const path = `${this.configService.configApiUrl}/pgu-service-config/config/${this.configService.configId}`;
    return this.http.get<Config>(path);
  }
}
