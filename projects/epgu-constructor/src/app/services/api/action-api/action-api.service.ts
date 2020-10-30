import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionApiDTO, ActionApiResponse } from './action-api.types';
import { apiUrlDefault } from '../form-player-api/form-player-api.service';
import { LoadService } from 'epgu-lib';

@Injectable()
export class ActionApiService {
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

  /**
   * Метод для отправки action на бэкенд. На бэке есть дополнительные эндпоинты для каждго экшена
   * @param path - route для экшена на бэке
   * @param body - тело запроса
   */
  send<T>(path: string, body: ActionApiDTO): Observable<ActionApiResponse<T>> {
    return this.http.post<ActionApiResponse<T>>(`${this.apiUrl}/${path}`, body);
  }
}
