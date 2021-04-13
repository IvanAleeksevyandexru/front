import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SopService } from './sop.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import {
  SopOptions,
  SopOptionsFilter,
  SopProjectionMode,
  SopRequestFilter,
  SopRequestOptions,
  SopResponse
} from './sop.types';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../dictionary/dictionary-api.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { DictionaryValueTypes } from '../dictionary/dictionary-api.types';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../date-range/date-range.service';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { configureTestSuite } from 'ng-bullet';

const generateRequestBody = (options: SopOptions): SopRequestOptions => {
  let filter = {};
  if (options?.filter) {
    const requestFilters = options.filter.map((filter: SopOptionsFilter): SopRequestFilter => ({
      columnUid: filter.columnUid,
      value: filter.value,
    }));
    filter = { filter: { filters: requestFilters }};
  }

  return {
    levenshtein: 2,
    limit: {
      pageNumber: options.pageNum || 1,
      pageSize: options.pageSize || 100,
    },
    projection: {
      columnUids: options.columnUids || [],
      mode: 'INCLUDE' as SopProjectionMode,
    },
    sourceUid: options.sourceUid,
    ...filter,
    dictionarySopTest: options.dictionarySopTest || false,
  };
};

const getAdoptedResponse = (response: SopResponse, key: string, value: string): SopResponse => {
  const items = response.data.map((item) => ({
    originalItem: item,
    id: item[key] as string,
    text: item[value] as string,
  }));

  return {
    ...response,
    items,
  };
};

describe('SopService', () => {
  let service: SopService;
  let http: HttpTestingController;
  let config: ConfigService;
  let sopApiUrl = 'http://sop.test.gosuslugi.ru/cps-data-api/api/v1/data';
  let responseMock = {
    errors: [],
    sourceUid: '42fd59f8-cea9-41f8-9fad-f53c74aec567',
    lastPage: false,
    data: [
      {
        value: 'Some value',
        title: 'Some Title',
        divisionCode: '044041012',
        toPfrCode: '044041',
        isJuristical: false,
        OKTMO: '18701000001',
        name:
          'Центр ПФР №2 по установлению пенсий в Волгоградской области, Клиентская служба в Клетском районе',
        _score: 1.0,
        shortName:
          'Центр ПФР №2 по установлению пенсий в Волгоградской области, Клиентская служба в Клетском районе',
        type: 3,
        OKATO: '18401385000',
      },
    ],
  };
  let optionsMock: SopOptions = {
    sourceUid: '42fd59f8-cea9-41f8-9fad-f53c74aec567',
    dictionarySopTest: true,
    key: 'OKTMO',
    value: 'name',
    filter: [
      {
        columnUid: '1a4fc9f7-1014-4376-a3ec-b96056bdcf3d',
        value: '45000',
        valueType: 'value' as DictionaryValueTypes,
      },
    ],
    pageNum: 2,
    pageSize: 30,
    columnUids: [
      '1a4fc9f7-1014-4376-a3ec-b96056bdcf3d',
      '8caf6cb5-43a0-46b1-bf57-2bb1462a10c0',
      'b8bc7170-8635-42d0-8ec3-604e3ee3dd2c',
      'c31f0a0e-79b4-4af3-9c66-9fc7bd830b00',
      'c247f83d-55a6-46b7-91b2-6b41c41e5ca1',
    ],
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SopService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SopService);
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
  });

  afterEach(async(() => http.verify()));

  describe('getDictionary()', () => {
    it('should call http with post method', fakeAsync(() => {
      service
        .getDictionary(optionsMock)
        .subscribe((response) =>
          expect(response).toEqual(
            getAdoptedResponse(responseMock, optionsMock.key, optionsMock.value),
          ),
        );

      const req = http.expectOne(sopApiUrl);

      expect(req.request.method).toBe('POST');

      req.flush(responseMock);
      tick();
    }));

    it('should call http with body if set options', fakeAsync(() => {
      service
        .getDictionary(optionsMock)
        .subscribe((response) =>
          expect(response).toEqual(
            getAdoptedResponse(responseMock, optionsMock.key, optionsMock.value),
          ),
        );

      const req = http.expectOne(sopApiUrl);

      expect(req.request.body).toEqual(generateRequestBody({ ...optionsMock }));

      req.flush(responseMock);
      tick();
    }));

    it('should call http with body if not set options', fakeAsync(() => {
      service
        .getDictionary({ sourceUid: optionsMock.sourceUid })
        .subscribe((response) =>
          expect(response).toEqual(getAdoptedResponse(responseMock, 'value', 'title')),
        );

      const req = http.expectOne(sopApiUrl);

      expect(req.request.body).toEqual(generateRequestBody({ sourceUid: optionsMock.sourceUid }));
      req.flush(responseMock);
      tick();
    }));
  });
});
