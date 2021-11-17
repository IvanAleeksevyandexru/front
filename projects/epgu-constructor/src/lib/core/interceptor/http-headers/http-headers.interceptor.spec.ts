import { TestBed, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpHeadersInterceptor } from './http-headers.interceptor';
import { InitDataService } from '../../services/init-data/init-data.service';
import { InitDataServiceStub } from '../../services/init-data/init-data.service.stub';
import { LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';

describe('HttpHeadersInterceptor', () => {
  let initDataService: InitDataService;
  let locationService: LocationService;
  let httpTestingController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true },
      ],
    }),
  );

  beforeEach(() => {
    initDataService = TestBed.inject(InitDataService);
    locationService = TestBed.inject(LocationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    initDataService.orderId = 123;
    jest.spyOn(locationService, 'path').mockReturnValue('/600103/1/form');
  });

  afterEach(waitForAsync(() => httpTestingController.verify()));

  describe('intercept', () => {
    it('should be add headers after dictionary request', (done) => {
      const url = 'https://pgu-uat-fed.test.gosuslugi.ru/api/nsi/v1/dictionary/STRANI_IST';
      http.get(url).subscribe(() => done());
      const req = httpTestingController.expectOne(url);
      expect(req.request.headers.get('X-ORDER-ID')).toBe('123');
      expect(req.request.headers.get('X-FORM-ID')).toBe('600103/1');
      req.flush('');
    });

    it('should be add headers after book request', (done) => {
      const url = 'https://www.gosuslugi.ru/api/lk/v1/equeue/agg/book';
      http.get(url).subscribe(() => done());
      const req = httpTestingController.expectOne(url);
      expect(req.request.headers.get('X-ORDER-ID')).toBe('123');
      expect(req.request.headers.get('X-FORM-ID')).toBe('600103/1');
      req.flush('');
    });

    it('should be add headers after slot request', (done) => {
      const url = 'https://www.gosuslugi.ru/api/lk/v1/equeue/agg/slots';
      http.get(url).subscribe(() => done());
      const req = httpTestingController.expectOne(url);
      expect(req.request.headers.get('X-ORDER-ID')).toBe('123');
      expect(req.request.headers.get('X-FORM-ID')).toBe('600103/1');
      req.flush('');
    });
  });
});
