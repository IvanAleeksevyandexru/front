import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../config/config.service';
import { Observable } from 'rxjs';

@Injectable()
export class ActionApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  send<T>(path: string, body): Observable<T> {
    return this.http.post<T>(`${this.config.apiUrl}/${path}`, body);
  }
}
