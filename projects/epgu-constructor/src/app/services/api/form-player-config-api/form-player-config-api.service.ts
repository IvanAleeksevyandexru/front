import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../../config/config.types';


@Injectable()
export class FormPlayerConfigApiService {
  constructor(
    private http: HttpClient,
  ) {}

  public getFormPlayerConfig(): Observable<Config> {
    const path = '/api/pgu-service-config/default-config';
    return this.http.get<Config>(path);
  }

}
