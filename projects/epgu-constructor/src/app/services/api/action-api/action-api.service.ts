import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../../../config/config.service';
import { ScreenStore } from '../../../screen/screen.types';
import { apiUrl } from '../form-player-api/form-player-api.service';

@Injectable()
export class ActionApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  send<T>(path: string, body: ScreenStore, responseType?: 'blob'): Observable<T | Blob> {
    if (responseType === 'blob') {
      return this.http.post(`${apiUrl}/${path}`, body, {
        responseType: 'blob',
      });
    } else {
      return this.http.post<T>(`${apiUrl}/${path}`, body);
    }
  }
}
