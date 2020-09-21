import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { FormPlayerNavigation } from '../../../form-player.types';
import { FormPlayerApiService } from './form-player-api.service';
import { ServiceDataService } from '../../service-data/service-data.service';


describe('FormPlayerApiService', () => {
  let service: FormPlayerApiService;
  let http: HttpTestingController;
  let config: ConfigService;
  let apiUrl = '/api';
  let serviceId = 'local';
  let targetId = 'local';
  let orderId = '12345';
  let responseMock = [42];
  let mockData = { scenarioDto: {}};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        ServiceDataService,
        CookieService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(FormPlayerApiService);
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
  }));

  afterEach(waitForAsync(() => http.verify()));

  describe('getInviteServiceData()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.getInviteServiceData(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/invite/service/${serviceId}/scenario`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http post with withCredentials equal false', fakeAsync(() => {
      service.getInviteServiceData(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/invite/service/${serviceId}/scenario`);
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(false);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getServiceData()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.getServiceData().subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body without orderId', fakeAsync(() => {
      service.getServiceData().subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      const body = req.request.body;
      expect(body).toEqual({ targetId, token: '', userId: '' });
      req.flush(responseMock);
      tick();
    }));

    it('should call with body with orderId', fakeAsync(() => {
      service.getServiceData(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      const body = req.request.body;
      expect(body).toEqual({ targetId, orderId, token: '', userId: '' });
      req.flush(responseMock);
      tick();
    }));

    it('should call http post with withCredentials equal false', fakeAsync(() => {
      service.getServiceData().subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(false);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('navigate()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.navigate(serviceId, mockData, { direction: FormPlayerNavigation.NEXT })
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getNextStep path', fakeAsync(() => {
      service.navigate(serviceId, mockData, { direction: FormPlayerNavigation.NEXT })
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getPrevStep path', fakeAsync(() => {
      service.navigate(serviceId, mockData, { direction: FormPlayerNavigation.PREV })
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body', fakeAsync(() => {
      service.navigate(serviceId, mockData,{ direction: FormPlayerNavigation.PREV })
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.body).toEqual(mockData);
      req.flush(responseMock);
      tick();
    }));
  });
});
