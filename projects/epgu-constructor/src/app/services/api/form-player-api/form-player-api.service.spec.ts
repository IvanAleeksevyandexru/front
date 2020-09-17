import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { FormPlayerNavigation } from '../../../form-player.types';
import { FormPlayerApiService } from './form-player-api.service';
import { UnsubscribeService } from '../../unsubscribe/unsubscribe.service';


describe('FormPlayerApiService', () => {
  let service: FormPlayerApiService;
  let http: HttpTestingController;
  let config: ConfigService;
  let apiUrl = '/api';
  let serviceId = 'local';
  let orderId = '12345';
  let responseMock = [42];
  let mockData = { scenarioDto: {}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        CookieService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(FormPlayerApiService);
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
  }));

  afterEach(async(() => http.verify()));

  describe('getDraftData()', () => {
    it('should call http with get method', fakeAsync(() => {
      service.getDraftData(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/drafts/${orderId}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));

    it('should call http get with withCredentials equal false', fakeAsync(() => {
      service.getDraftData(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/drafts/${orderId}`);
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(false);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getServiceData()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.getServiceData(serviceId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http post with withCredentials equal false', fakeAsync(() => {
      service.getServiceData(serviceId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(false);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('navigate()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.navigate(serviceId, FormPlayerNavigation.NEXT, mockData).subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getNextStep path', fakeAsync(() => {
      service.navigate(serviceId, FormPlayerNavigation.NEXT, mockData).subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getPrevStep path', fakeAsync(() => {
      service.navigate(serviceId, FormPlayerNavigation.PREV, mockData).subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body', fakeAsync(() => {
      service.navigate(serviceId, FormPlayerNavigation.PREV, mockData).subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.body).toEqual(mockData);
      req.flush(responseMock);
      tick();
    }));
  });
});
