import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../../../config/config.service';
import { ActionApiDTO } from './action-api.types';

@Injectable()
export class ActionApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  send<T>(path: string, body: ActionApiDTO, responseType?: 'blob'): Observable<T | Blob> {
    if (responseType === 'blob') {
      return this.http.post(`${this.config.apiUrl}/${path}`, body, {
        responseType: 'blob',
      });
    } else {
      return this.http.post<T>(`${this.config.apiUrl}/${path}`, body);
    }
  }
}
