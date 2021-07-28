import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

import { LocalStorageService, UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { ApplicantAnswersDto, DictionaryOptions, LogicComponentAttrsDto, LogicComponents } from '@epgu/epgu-constructor-types';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../screen/screen.service';
import { CustomComponent } from '../../custom-screen/components-list.types';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

@Injectable()
export class LogicService {
  readonly maxTimeout = 600000;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private dictionaryToolsService: DictionaryToolsService,
    private screenService: ScreenService,
    private dictionaryApiService: DictionaryApiService,
    private currentAnswersService: CurrentAnswersService,
    private utils: UtilsService,
  ) {}

  public fetch(
    components: LogicComponents[],
  ): Array<Observable<ApplicantAnswersDto>> {
    return components.map((logicComponent) => {
      const value = logicComponent.value as unknown as LogicComponentAttrsDto;
      return this.makeRequestAndCall(logicComponent).pipe(
        timeout(value.timeout ? parseFloat(value.timeout) : this.maxTimeout),
        map((response) => this.createLogicAnswers(logicComponent.id, response)),
        catchError((error: TimeoutError | HttpErrorResponse) => {
          if (error instanceof TimeoutError) {
            return of(this.createLogicAnswers(logicComponent.id, this.createErrorFromTimeout(value.url)));
          }

          return of(this.createLogicAnswers(logicComponent.id, error));
        }),
      );
    });
  }

  private makeRequestAndCall(component: LogicComponents): Observable<HttpResponse<object>>  {
    return (component?.attrs?.dictionaryFilter && component?.attrs?.dictionaryType) ?
      this.callDictionaryRequest(component.attrs) :
      this.callHttpMethod(component.value as unknown as LogicComponentAttrsDto);
  }

  private callDictionaryRequest(value: LogicComponentAttrsDto): Observable<HttpResponse<object>> {
    const {
      dictionaryType,
      dictionaryFilter = null,
      dictionaryUrlType
    } = value;

    const state = this.utils.tryToParseOrDefault(this.currentAnswersService.state);
    const store = {
      ...this.screenService.getStore(),
      applicantAnswers: {
        ...this.screenService.getStore().applicantAnswers,
        ...state as ApplicantAnswersDto,
      },
    };

    const component = {} as CustomComponent;
    const defaultOptions: DictionaryOptions = { pageNum: 0 };
    const options: DictionaryOptions = {
      ...defaultOptions,
      ...(dictionaryFilter
        ? this.dictionaryToolsService.prepareOptions(component, store, dictionaryFilter)
        : {}),
    };

    return this.dictionaryApiService
      .getDictionary(dictionaryType, options, dictionaryUrlType) as unknown as Observable<HttpResponse<object>>;
  }

  private callHttpMethod(value: LogicComponentAttrsDto): Observable<HttpResponse<object>> {
    const method = value.method.toLocaleLowerCase();
    const hasBody = ['POST', 'PUT'].includes(value.method);
    this.localStorageService.setRaw(value.url, value.body || '');
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
    response: HttpResponse<unknown> | HttpErrorResponse | object,
  ): ApplicantAnswersDto {
    if (response instanceof HttpResponse || response instanceof HttpErrorResponse) {
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

    return {
      [id]: {
        visited: true,
        value: JSON.stringify(response),
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
