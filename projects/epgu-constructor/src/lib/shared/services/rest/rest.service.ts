import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponentMethods, RestAttrsDto } from '@epgu/epgu-constructor-types';

const METHODS_WITH_BODY = [LogicComponentMethods.POST, LogicComponentMethods.PUT];

@Injectable()
export class RestService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public fetch<T>(restAttrs: RestAttrsDto): Observable<HttpResponse<T>> {
    const method = restAttrs.method.toLowerCase();
    const hasBody = METHODS_WITH_BODY.includes(
      restAttrs.method.toUpperCase() as LogicComponentMethods,
    );
    this.localStorageService.setRaw(restAttrs.url, restAttrs.body || '');
    const options = {
      headers: new HttpHeaders(restAttrs.headers),
      withCredentials: true,
      observe: 'response',
    };

    return hasBody
      ? this.http[method](restAttrs.url, restAttrs.body, options)
      : this.http[method](restAttrs.url, options);
  }
}
