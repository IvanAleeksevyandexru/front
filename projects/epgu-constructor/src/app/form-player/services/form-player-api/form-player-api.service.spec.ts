import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { FormPlayerNavigation } from '../../form-player.types';
import { FormPlayerApiService } from './form-player-api.service';
import { ServiceDataService } from '../service-data/service-data.service';
import { Gender } from '../../../shared/types/gender';
import { ScreenTypes } from '../../../screen/screen.types';


xdescribe('FormPlayerApiService', () => {
  let service: FormPlayerApiService;
  let http: HttpTestingController;
  let apiUrl = '/api';
  let serviceId = 'local';
  let targetId = 'local';
  let orderId = '12345';
  let responseMock = [42];
  let mockData = {
    scenarioDto: {
      applicantAnswers: {},
      currentCycledFields: {},
      currentScenarioId: '',
      cachedAnswers: {},
      currentValue: {},
      cycledFields: [],
      display: {
        components: [],
        header: '',
        subHeader: {
          text: '',
          clarifications: {},
        },
        id: '',
        name: '',
        submitLabel: '',
        type: ScreenTypes.QUESTION,
        terminal: false,
      },
      errors: {},
      gender: Gender.male,
      finishedAndCurrentScreens: [],
      orderId: '10462',
      token: '487545987',
      userId: '487545987',
      isInternalScenario: false,
      serviceId: '487545987',
      currentUrl: '487545987',
    },
    isInternalScenario: false
  };
  let mockNavigationOptions = {
    isInternalScenarioFinish: false,
    url: ''
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        ServiceDataService,
        CookieService
      ]
    });
    service = TestBed.inject(FormPlayerApiService);
    http = TestBed.inject(HttpTestingController);
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
      service.navigate(mockData, mockNavigationOptions, FormPlayerNavigation.NEXT)
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getNextStep path', fakeAsync(() => {
      service.navigate(mockData, mockNavigationOptions, FormPlayerNavigation.NEXT )
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getPrevStep path', fakeAsync(() => {
      service.navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with body', fakeAsync(() => {
      service.navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.body).toEqual(mockData);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('navigate()', () => {
    it('should call http with post method', fakeAsync(() => {
      const path = 'editPhoneNumber';
      const responseMockData = {};

      service.sendAction(path, mockData).subscribe((response) => expect(response).toBe(responseMockData));
      const req = http.expectOne(`${apiUrl}/${path}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMockData);
      tick();
    }));
  });
});
