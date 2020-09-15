import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class DadataApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  getDadataByFias(fiasCode: string) {
    const path = `${this.config.externalApiUrl}/dadata/${fiasCode}`;
    return this.http.get(path);
  }
}
