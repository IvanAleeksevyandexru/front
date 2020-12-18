import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormPlayerNavigation } from '../../form-player.types';
import { FormPlayerApiService } from './form-player-api.service';
import { ServiceDataService } from '../service-data/service-data.service';
import { Gender } from '../../../shared/types/gender';
import { ScreenTypes } from '../../../screen/screen.types';
import { ServiceDataServiceStub } from '../service-data/service-data.service.stub';
import { ConfigService } from '../../../core/config/config.service';
import { ConfigServiceStub } from '../../../core/config/config.service.stub';


describe('FormPlayerApiService', () => {
  let service: FormPlayerApiService;
  let serviceDataService: ServiceDataService;
  let http: HttpTestingController;
  let apiUrl = '/api';
  let serviceId = 'local';
  let targetId = 'local';
  let orderId = '12345';
  let responseMock = [42];
  let mockData = {
    scenarioDto: {
      applicantAnswers: {},
      currentScenarioId: '',
      cachedAnswers: {},
      currentValue: {},
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
        { provide: ServiceDataService, useClass: ServiceDataServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerApiService);
    serviceDataService = TestBed.inject(ServiceDataService);
    serviceDataService['_targetId'] = targetId;
    serviceDataService['_orderId'] = orderId;
    serviceDataService['_serviceId'] = serviceId;
    http = TestBed.inject(HttpTestingController);
  }));

  afterEach(waitForAsync(() => http.verify()));

  describe('checkIfOrderExist()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.checkIfOrderExist().subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service.checkIfOrderExist().subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`);
      const body = req.request.body;
      expect(body).toEqual({ targetId });
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getOrderStatus()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.getOrderStatus(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getOrderStatus`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service.getOrderStatus(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getOrderStatus`);
      const body = req.request.body;
      expect(body).toEqual({ targetId, orderId });
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
      expect(body).toEqual({ targetId });
      req.flush(responseMock);
      tick();
    }));

    it('should call with body with orderId', fakeAsync(() => {
      service.getServiceData(orderId).subscribe(response => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      const body = req.request.body;
      expect(body).toEqual({ targetId, orderId });
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

    it('should call http with params', fakeAsync(() => {
      let mockNavigationOptions = {
        params: { stepsBack: 2 }
      };
      service.navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe(response => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}?stepsBack=2`;
      const req = http.expectOne(url);
      expect(req.request.params.has('stepsBack')).toBeTruthy();
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
