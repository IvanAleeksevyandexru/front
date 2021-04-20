import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

import { ComponentValue } from '../logic.types';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { ApplicantAnswersDto } from 'epgu-constructor-types/dist/base/applicant-answers';

@Injectable()
export class LogicService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public fetch(
    components: { id: string; value: ComponentValue }[],
  ): Observable<ApplicantAnswersDto>[] {
    return components.map(({ value, id }) => {
      return this.callHttpMethod(value).pipe(
        timeout(value.timeout ? parseFloat(value.timeout) : Infinity),
        map((response) => this.createLogicAnswers(id, response)),
        catchError((error: TimeoutError | HttpErrorResponse) => {
          if (error instanceof TimeoutError) {
            return of(this.createLogicAnswers(id, this.createErrorFromTimeout(value.url)));
          }

          return of(this.createLogicAnswers(id, error));
        }),
      );
    });
  }

  private callHttpMethod(value: ComponentValue): Observable<HttpResponse<object>> {
    const method = value.method.toLocaleLowerCase();
    const hasBody = ['POST', 'PUT'].includes(value.method);
    this.localStorageService.setRaw(value.url, value.body);
    const options = {
      headers: new HttpHeaders(value.headers),
      withCredentials: true,
      observe: 'response',
    };

    if (hasBody) {
      return this.http[method](value.url, value.body, options);
    }

    return this.http[method](value.url, options);
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

  private createErrorFromTimeout(url: string): HttpErrorResponse {
    return new HttpErrorResponse({
      error: '408 Request Timeout',
      headers: new HttpHeaders(),
      status: 408,
      url,
    });
  }
}
