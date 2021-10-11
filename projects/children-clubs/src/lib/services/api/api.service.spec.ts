import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService, SessionService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { ApiService } from './api.service';
import { FindOptionsGroup, FindOptionsProgram } from '../../typings';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {
  PROGRAM_DETAIL_SUB_URL,
  SEARCH_PROGRAM_SUB_URL,
  SEARCH_GROUP_SUB_URL,
  DIRECTIONS_SUB_URL,
  MUNICIPALITIES_SUB_URL,
} from '../health/health-handler';

describe('ApiService', () => {
  let service: ApiService;
  let configService: ConfigService;
  let http: HttpTestingController;

  const okato = 14;
  let responseMock = { items: 42 };
  const uuid = '1';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        LocationService,
        WINDOW_PROVIDERS,
        SessionService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ApiService);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(waitForAsync(() => http.verify()));

  describe('getProgramList()', () => {
    const reqBody = ({} as unknown) as FindOptionsProgram;

    it('should call http with post method', fakeAsync(() => {
      service
        .getProgramList(reqBody)
        .subscribe((response) => expect(response).toBe(responseMock.items));
      const req = http.expectOne(`${SEARCH_PROGRAM_SUB_URL}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service
        .getProgramList(reqBody)
        .subscribe((response) => expect(response).toBe(responseMock.items));
      const req = http.expectOne(`${SEARCH_PROGRAM_SUB_URL}`);
      const body = req.request.body;
      expect(body).toEqual(reqBody);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getProgram()', () => {
    const nextSchoolUYear = true;

    it('should call http with get method and passed params', fakeAsync(() => {
      service.getProgram(uuid, true).subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(
        `${PROGRAM_DETAIL_SUB_URL}${uuid}?nextSchoolYear=${nextSchoolUYear}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getGroupList()', () => {
    const reqBody = ({} as unknown) as FindOptionsGroup;

    it('should call http with post method', fakeAsync(() => {
      service
        .getGroupList(uuid, reqBody)
        .subscribe((response) => expect(response).toBe(responseMock.items));
      const req = http.expectOne(`${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service
        .getGroupList(uuid, reqBody)
        .subscribe((response) => expect(response).toBe(responseMock.items));
      const req = http.expectOne(`${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`);
      const body = req.request.body;
      expect(body).toEqual(reqBody);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getDirections()', () => {
    it('should call http with get method and passed params', fakeAsync(() => {
      service
        .getDirections(okato)
        .subscribe((response) => expect(response).toBe(responseMock.items));
      const req = http.expectOne(`${DIRECTIONS_SUB_URL}?okato=${okato}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getMunicipalities()', () => {
    it('should call http with get method and passed params', fakeAsync(() => {
      service
        .getMunicipalities(okato)
        .subscribe((response) => expect(response).toBe(responseMock.items));
      const req = http.expectOne(`${MUNICIPALITIES_SUB_URL}?okato=${okato}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));
  });
});
