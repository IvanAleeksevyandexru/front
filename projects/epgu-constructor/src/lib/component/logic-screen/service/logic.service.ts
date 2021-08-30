import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

import { LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import {
  ApplicantAnswersDto,
  DictionaryOptions,
  LogicComponentAttrsDto,
  LogicComponents,
} from '@epgu/epgu-constructor-types';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../screen/screen.service';
import { CustomComponent } from '../../custom-screen/components-list.types';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { RestService } from '../../../shared/services/rest/rest.service';

@Injectable()
export class LogicService {
  readonly maxTimeout = 600000;
  constructor(
    private localStorageService: LocalStorageService,
    private dictionaryToolsService: DictionaryToolsService,
    private screenService: ScreenService,
    private dictionaryApiService: DictionaryApiService,
    private currentAnswersService: CurrentAnswersService,
    private jsonHelperService: JsonHelperService,
    private restService: RestService,
  ) {}

  public fetch(components: LogicComponents[]): Observable<ApplicantAnswersDto>[] {
    return components.map((logicComponent) => {
      const value = (logicComponent.value as unknown) as LogicComponentAttrsDto;
      return this.makeRequestAndCall(logicComponent).pipe(
        timeout(value.timeout ? parseFloat(value.timeout) : this.maxTimeout),
        map((response) => this.createLogicAnswers(logicComponent.id, response)),
        catchError((error: TimeoutError | HttpErrorResponse) => {
          if (error instanceof TimeoutError) {
            return of(
              this.createLogicAnswers(logicComponent.id, this.createErrorFromTimeout(value.url)),
            );
          }

          return of(this.createLogicAnswers(logicComponent.id, error));
        }),
      );
    });
  }

  private makeRequestAndCall(component: LogicComponents): Observable<HttpResponse<object>> {
    return component?.attrs?.dictionaryFilter && component?.attrs?.dictionaryType
      ? this.callDictionaryRequest(component.attrs)
      : this.restService.fetch<HttpResponse<unknown>>(
          (component.value as unknown) as LogicComponentAttrsDto,
        );
  }

  private callDictionaryRequest(value: LogicComponentAttrsDto): Observable<HttpResponse<object>> {
    const { dictionaryType, dictionaryFilter = null, dictionaryUrlType } = value;

    const state = this.jsonHelperService.tryToParse(this.currentAnswersService.state, {});
    const store = {
      ...this.screenService.getStore(),
      applicantAnswers: {
        ...this.screenService.getStore().applicantAnswers,
        ...(state as ApplicantAnswersDto),
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

    return (this.dictionaryApiService.getDictionary(
      dictionaryType,
      options,
      dictionaryUrlType,
    ) as unknown) as Observable<HttpResponse<object>>;
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
