import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { LogicService } from './logic.service';
import {
  DatesToolsService,
  LocalStorageService,
  LocalStorageServiceStub,
  ObjectHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookServiceStub } from '../../../core/services/hook/hook.service.stub';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../screen/screen.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary/dictionary-api.service.stub';
import { MockProviders } from 'ng-mocks';
import { ComponentsListRelationsService } from '../../custom-screen/services/components-list-relations/components-list-relations.service';
import { SuggestHandlerService } from '../../../shared/services/suggest-handler/suggest-handler.service';
import { ComponentsListFormService } from '../../custom-screen/services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../custom-screen/services/components-list-form/components-list-form.service.stub';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ComponentValue, LogicComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { of, throwError } from 'rxjs';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { RestService } from '../../../shared/services/rest/rest.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

describe('LogicService', () => {
  let service: LogicService;
  let restService: RestService;
  let dictionaryToolsService: DictionaryToolsService;
  let dictionaryApiService: DictionaryApiService;
  let httpTestingController: HttpTestingController;
  let localStorage: LocalStorageService;
  const componentsPOST: { id: string; value: ComponentValue }[] = [
    {
      id: 'rest1',
      value: {
        url: 'url',
        headers: { headers: 'headers' },
        method: 'POST',
        body: 'body',
        path: 'path',
      },
    },
  ];
  const componentsWithTimeOut: { id: string; value: ComponentValue }[] = [
    {
      id: 'rest1',
      value: {
        url: 'url',
        headers: { headers: 'headers' },
        method: 'POST',
        body: 'body',
        path: 'path',
        timeout: '10',
      },
    },
  ];
  const componentsWithDictionary: {
    id: string;
    attrs: LogicComponentAttrsDto;
    value: ComponentValue;
  }[] = [
    {
      id: 'rest1',
      attrs: {
        dictionaryType: 'CONC_COMPETENT_ORG',
        dictionaryFilter: [
          {
            attributeName: 'LIC_TYPE',
            attributeType: 'asDecimal',
            condition: 'EQUALS',
            value: 's6lookup.value.originalItem.attributeValues.CODE',
            valueType: 'ref',
          },
        ],
      },
      value: {
        url: 'url',
        headers: { headers: 'headers' },
        method: 'POST',
        body: 'body',
        path: 'path',
        timeout: '10',
      },
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogicService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: HookService, useClass: HookServiceStub },
        DictionaryToolsService,
        CurrentAnswersService,
        JsonHelperService,
        ObjectHelperService,
        MockProviders(RestService),
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        MockProviders(DatesToolsService, ComponentsListRelationsService, SuggestHandlerService),
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(LogicService);
    httpTestingController = TestBed.inject(HttpTestingController);
    restService = TestBed.inject(RestService);
    localStorage = TestBed.inject(LocalStorageService);
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('fetch', () => {
    it('should be create http request', () => {
      jest.spyOn(restService, 'fetch').mockReturnValue(of(null));
      const reqComponents = service.fetch(componentsPOST);
      expect(reqComponents.length).toBeGreaterThan(0);
    });
  });

  describe('callHttpMethod', () => {
    it('should be return request with body', () => {
      const spyRestFetch = jest.spyOn(restService, 'fetch').mockReturnValue(of(null));

      service.fetch(componentsPOST)[0].subscribe();

      expect(spyRestFetch).toBeCalledTimes(1);
      expect(spyRestFetch).toBeCalledWith(componentsPOST[0].value);
    });
  });

  describe('makeRequestAndCall', () => {
    it('should be return request with body', () => {
      const store = { applicantAnswers: {}, cachedAnswers: [] };
      const filters = [
        {
          attributeName: 'LIC_TYPE',
          attributeType: 'asDecimal',
          condition: 'EQUALS',
          value: 's6lookup.value.originalItem.attributeValues.CODE',
          valueType: 'ref',
        },
      ];

      const prepareSpy = jest
        .spyOn(dictionaryToolsService, 'prepareOptions')
        .mockReturnValue({ filter: filters });
      const getDictionarySpy = jest
        .spyOn(dictionaryApiService, 'getDictionary')
        .mockReturnValue(of({}));
      service.fetch(componentsWithDictionary)[0].subscribe();

      expect(prepareSpy).toHaveBeenCalledWith({}, store, filters);
      expect(getDictionarySpy).toHaveBeenCalledWith(
        'CONC_COMPETENT_ORG',
        { filter: filters, pageNum: 0 },
        undefined,
      );
    });
  });

  describe('createLogicAnswers', () => {
    jest.useFakeTimers();
    it('should be create logic answers if success response', () => {
      jest.spyOn(restService, 'fetch').mockReturnValue(
        of(
          new HttpResponse({
            status: 200,
            body: { body: 'body' },
          }),
        ),
      );

      service.fetch(componentsPOST)[0].subscribe((response) => {
        expect(response).toEqual({
          rest1: {
            visited: true,
            value: '{"headers":[],"code":"200","body":{"body":"body"}}',
          },
        });
      });
      jest.runAllTimers();
    });

    it('should be create logic answers if error response', () => {
      jest.spyOn(restService, 'fetch').mockReturnValue(
        throwError(
          new HttpErrorResponse({
            status: 500,
            error: 'body',
          }),
        ),
      );

      service.fetch(componentsPOST)[0].subscribe((response) => {
        expect(response).toEqual({
          rest1: {
            visited: true,
            value: '{"headers":[],"code":"500","body":"body"}',
          },
        });
      });

      jest.runAllTimers();
    });

    it('should be remove value from localStorage', () => {
      const spy = jest.spyOn(localStorage, 'delete');
      const response = new HttpResponse({ body: 'body', url: 'Some_url' });
      jest.spyOn(restService, 'fetch').mockReturnValue(of(response));

      service.fetch(componentsPOST)[0].subscribe();

      expect(spy).toHaveBeenCalledWith(response.url);
    });

    it('should be create logic answers if timeout error', () => {
      jest.spyOn(restService, 'fetch').mockReturnValue(
        of(
          new HttpResponse({
            status: 408,
            body: '408 Request Timeout',
          }),
        ),
      );

      service.fetch(componentsWithTimeOut)[0].subscribe((response) => {
        expect(response).toEqual({
          rest1: {
            visited: true,
            value: '{"headers":[],"code":"408","body":"408 Request Timeout"}',
          },
        });
      });
      jest.runAllTimers();
    });
  });
});
