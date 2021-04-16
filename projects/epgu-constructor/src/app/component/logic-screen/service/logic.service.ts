import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ComponentValue } from '../logic.types';
import { ApplicantAnswersDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';

@Injectable()
export class LogicService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public fetch(
    components: { id: string; value: ComponentValue }[],
  ): Observable<ApplicantAnswersDto>[] {
    return components.map(({ value, id }) => {
      return this.callHttpMethod(value).pipe(
        map((response) => this.createLogicAnswers(id, response)),
        catchError((error: HttpErrorResponse) => of(this.createLogicAnswers(id, error))),
      );
    });
  }

  private callHttpMethod(value: ComponentValue): Observable<HttpResponse<object>> {
    const headers = new HttpHeaders(value.headers);
    const method = value.method.toLocaleLowerCase();
    const hasBody = ['POST', 'PUT'].includes(value.method);
    this.localStorageService.setRaw(value.url, value.body);

    if (hasBody) {
      return this.http[method](value.url, value.body, {
        headers,
        withCredentials: true,
        observe: 'response',
      });
    }

    return this.http[method](value.url, {
      headers,
      withCredentials: true,
      observe: 'response',
    });
  }

  private createLogicAnswers(
    id: string,
    response: HttpResponse<unknown> | HttpErrorResponse,
  ): ApplicantAnswersDto {
    const headers = response.headers.keys().map((key) => ({ [key]: response.headers.get(key) }));
    this.localStorageService.delete(response.url);

    return {
      [id]: {
        visited: true,
        value: JSON.stringify({
          headers,
          code: response.status.toString(),
          body: response instanceof HttpResponse ? response.body : response.error,
        }),
      },
    };
  }
}
