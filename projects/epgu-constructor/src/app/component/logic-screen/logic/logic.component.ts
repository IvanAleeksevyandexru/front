import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable, of, pipe } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { ScreenService } from '../../../screen/screen.service';
import { ApplicantAnswersDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

interface ComponentValue {
  url: string;
  path: string;
  body: string;
  headers: { [key: string]: string };
  method: string;
}

interface Response {
  [key: string]: {
    headers: string[];
    code: string;
    body: string;
  };
}

@Component({
  selector: 'epgu-constructor-logic',
  templateUrl: './logic.component.html',
  styleUrls: ['./logic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogicComponent implements OnInit {
  components$ = this.screenService.logicComponents$.pipe(
    filter((components) => components.length > 0),
    map((components) => {
      return components.map((component) => ({
        id: component.id,
        value: JSON.parse(component.value) as ComponentValue,
      }));
    }),
    tap((components) => {
      this.cookieService.getAll();
    }),
    map((components) => this.fetch(components)),
    switchMap((components) => forkJoin(components)),
    map((response) => {
      return response.reduce(
        (acc, component) => ({
          ...acc,
          ...component,
        }),
        {},
      );
    }),
    catchError((error) => {
      console.log(error);
      return of({});
    }),
    tap((response) => {
      this.screenService.logicAnswers = {
        ...response,
      };
      console.log(this.screenService.logicAnswers);
    }),
  );

  constructor(
    private screenService: ScreenService,
    private http: HttpClient,
    private currentAnswersService: CurrentAnswersService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.cookieService.set('key', 'value');

    this.components$.subscribe();
  }

  private createLogicAnswers(
    id: string,
    response: HttpResponse<unknown> | HttpErrorResponse,
  ): ApplicantAnswersDto {
    const headers = response.headers.keys().map((key) => ({ [key]: response.headers.get(key) }));

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

  private fetch(
    components: { id: string; value: ComponentValue }[],
  ): Observable<ApplicantAnswersDto>[] {
    return components.map(({ value, id }) =>
      this.callHttpMethod(value).pipe(
        map((response): ApplicantAnswersDto => this.createLogicAnswers(id, response)),
        catchError(
          (error: HttpErrorResponse): Observable<ApplicantAnswersDto> =>
            of(this.createLogicAnswers(id, error)),
        ),
      ),
    );
  }

  private callHttpMethod(value: ComponentValue): Observable<HttpResponse<object>> {
    const headers = new HttpHeaders(value.headers);
    const method = value.method.toLocaleLowerCase();
    const hasBody = ['POST', 'PUT'].includes(value.method);
    console.log(value.headers);

    if (hasBody) {
      return this.http[method](`${value.url}`, value.body, {
        headers,
        withCredentials: true,
        observe: 'response',
      });
    }

    return this.http.get(`${value.url}`, {
      headers,
      withCredentials: true,
      observe: 'response',
    });
  }
}
