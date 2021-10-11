import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DictionaryApiService } from './dictionary-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';

describe('DictionaryApiService', () => {
  let service: DictionaryApiService;
  let http: HttpTestingController;
  let config: ConfigService;
  let dictionaryUrl = 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary';
  let responseMock = [42];
  let dictionaryName = 'someDictionary';
  let optionsMock = {
    filter: {
      someFilter: 'asd',
    },
    treeFiltering: 'TWOLEVEL',
    pageNum: 2,
    pageSize: '3000',
    parentRefItemValue: 'someRef',
    selectAttributes: ['//'],
    tx: 'someTx',
  };
  let additionalParams = {
    additionalParams: [
      {
        name: 'param1',
        value: 'value1',
      },
    ],
  };
  let excludedParams = {
    excludedParams: ['tx'],
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DictionaryApiService);
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
  });

  afterEach(fakeAsync(() => http.verify()));

  describe('getDictionary()', () => {
    it('should call http with post method', fakeAsync(() => {
      service
        .getDictionary(dictionaryName, optionsMock)
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body if set options', fakeAsync(() => {
      service
        .getDictionary(dictionaryName, optionsMock)
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      expect(req.request.body).toEqual({ ...optionsMock });
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body if not set options', fakeAsync(() => {
      service
        .getDictionary(dictionaryName)
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      expect(req.request.body).toEqual({
        filter: undefined,
        treeFiltering: 'ONELEVEL',
        pageNum: 1,
        pageSize: '10000',
        parentRefItemValue: '',
        selectAttributes: ['*'],
        tx: '',
      });
      req.flush(responseMock);
      tick();
    }));

    it('should apply additional params if additionalParams is defined', fakeAsync(() => {
      service
        .getDictionary(dictionaryName, { ...optionsMock, ...additionalParams })
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      expect(req.request.body).toEqual({
        ...optionsMock,
        param1: 'value1',
      });
      req.flush(responseMock);
      tick();
    }));

    it('should exclude params if excludedParams is defined', fakeAsync(() => {
      service
        .getDictionary(dictionaryName, { ...optionsMock, ...excludedParams })
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      const mock = optionsMock;
      delete mock['tx'];

      expect(req.request.body).toEqual(mock);
      req.flush(responseMock);
      tick();
    }));
  });
});
