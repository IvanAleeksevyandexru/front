import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ConfigService,
  ConfigServiceStub,
  LocationService,
  SessionService,
  UnsubscribeService,
  WINDOW_PROVIDERS,
} from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiService } from './dictionary-api.service';
import {
  FindOptionsProgram,
  FindOptionsGroup,
} from '../../../component/unique-screen/components/children-clubs/models/children-clubs.types';
import {
  SEARCH_PROGRAM_SUB_URL,
  PROGRAM_DETAIL_SUB_URL,
  SEARCH_GROUP_SUB_URL,
  DIRECTIONS_SUB_URL,
  MUNICIPALITIES_SUB_URL,
} from '../../../component/unique-screen/components/children-clubs/services/health/health-handler';

describe('DictionaryApiService', () => {
  let service: DictionaryApiService;
  let http: HttpTestingController;
  let configService: ConfigService;

  const okato = '14';
  const responseClubsMock = { items: 42 };
  const uuid = '1';
  const dictionaryUrl = 'https://svcdev-pgu.test.gosuslugi.ru/api/nsi/v1/dictionary';
  const responseMock = [42];
  const dictionaryName = 'someDictionary';
  const optionsMock = {
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
  const additionalParams = {
    additionalParams: [
      {
        name: 'param1',
        value: 'value1',
      },
    ],
  };
  const excludedParams = {
    excludedParams: ['tx'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        LocationService,
        WINDOW_PROVIDERS,
        SessionService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DictionaryApiService);
    http = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
  });

  afterEach(fakeAsync(() => http.verify()));

  describe('getGenericDictionary()', () => {
    it('should call http with post method', fakeAsync(() => {
      service
        .getGenericDictionary(dictionaryName, optionsMock)
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body if set options', fakeAsync(() => {
      service
        .getGenericDictionary(dictionaryName, optionsMock)
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      expect(req.request.body).toEqual({ ...optionsMock });
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body if not set options', fakeAsync(() => {
      service
        .getGenericDictionary(dictionaryName)
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
        .getGenericDictionary(dictionaryName, { ...optionsMock, ...additionalParams })
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
        .getGenericDictionary(dictionaryName, { ...optionsMock, ...excludedParams })
        .subscribe((response) => expect(response).toBe(responseMock));
      const path = `${dictionaryUrl}/${dictionaryName}`;
      const req = http.expectOne(path);
      const mock = optionsMock;
      delete mock.tx;

      expect(req.request.body).toEqual(mock);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getProgramList()', () => {
    const reqBody = ({} as unknown) as FindOptionsProgram;

    it('should call http with post method', fakeAsync(() => {
      service
        .getProgramList(reqBody)
        .subscribe((response) => expect(response).toBe(responseClubsMock.items));
      const req = http.expectOne(`${SEARCH_PROGRAM_SUB_URL}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseClubsMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service
        .getProgramList(reqBody)
        .subscribe((response) => expect(response).toBe(responseClubsMock.items));
      const req = http.expectOne(`${SEARCH_PROGRAM_SUB_URL}`);
      const { body } = req.request;
      expect(body).toEqual(reqBody);
      req.flush(responseClubsMock);
      tick();
    }));
  });

  describe('getProgram()', () => {
    const nextSchoolUYear = true;

    it('should call http with get method and passed params', fakeAsync(() => {
      service
        .getProgram(uuid, true)
        .subscribe((response) => expect(response).toBe(responseClubsMock));
      const req = http.expectOne(
        `${PROGRAM_DETAIL_SUB_URL}${uuid}?nextSchoolYear=${nextSchoolUYear}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(responseClubsMock);
      tick();
    }));
  });

  describe('getGroupList()', () => {
    const reqBody = ({} as unknown) as FindOptionsGroup;

    it('should call http with post method', fakeAsync(() => {
      service
        .getGroupList(uuid, reqBody)
        .subscribe((response) => expect(response).toBe(responseClubsMock.items));
      const req = http.expectOne(`${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseClubsMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service
        .getGroupList(uuid, reqBody)
        .subscribe((response) => expect(response).toBe(responseClubsMock.items));
      const req = http.expectOne(`${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`);
      const { body } = req.request;
      expect(body).toEqual(reqBody);
      req.flush(responseClubsMock);
      tick();
    }));
  });

  describe('getDirections()', () => {
    it('should call http with get method and passed params', fakeAsync(() => {
      service
        .getDirections(okato)
        .subscribe((response) => expect(response).toBe(responseClubsMock.items));
      const req = http.expectOne(`${DIRECTIONS_SUB_URL}?okato=${okato}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseClubsMock);
      tick();
    }));
  });

  describe('getMunicipalities()', () => {
    it('should call http with get method and passed params', fakeAsync(() => {
      service
        .getMunicipalities(okato)
        .subscribe((response) => expect(response).toBe(responseClubsMock.items));
      const req = http.expectOne(`${MUNICIPALITIES_SUB_URL}?okato=${okato}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseClubsMock);
      tick();
    }));
  });
});
