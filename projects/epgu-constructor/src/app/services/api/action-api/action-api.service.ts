import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionApiDTO, ActionApiResponse } from './action-api.types';
import { apiUrl } from '../form-player-api/form-player-api.service';

@Injectable()
export class ActionApiService {
  constructor(private http: HttpClient) {}

  /**
   * Метод для отправки action на бэкенд. На бэке есть дополнительные эндпоинты для каждго экшена
   * @param path - route для экшена на бэке
   * @param body - тело запроса
   */
  send<T>(path: string, body: ActionApiDTO): Observable<ActionApiResponse<T>> {
    return this.http.post<ActionApiResponse<T>>(`${apiUrl}/${path}`, body);
  }
}
