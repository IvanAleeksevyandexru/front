import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormPlayerNavigation, ServiceInfo } from '../../form-player.types';
import { FormPlayerApiService } from './form-player-api.service';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { FormPlayerApiSuccessResponse, ScreenTypes } from '@epgu/epgu-constructor-types';
import { InitDataServiceStub } from '../../../core/services/init-data/init-data.service.stub';
import { ConfigService, SessionService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { Gender } from '@epgu/epgu-constructor-types';

describe('FormPlayerApiService', () => {
  let service: FormPlayerApiService;
  let initDataService: InitDataService;
  let configService: ConfigService;
  let http: HttpTestingController;
  let apiUrl = '/api';
  let serviceId = 'local';
  let targetId = 'local';
  let orderId = 12345;
  let gepsId = 412345;
  let serviceInfo: ServiceInfo = {
    stateOrg: {
      id: 'id',
      title: 'title',
    },
    routingCode: 'routingCode',
    formPrefilling: true,
    infSysCode: 'infSysCode',
    error: 'error',
    userRegion: {
      name: 'name',
      path: 'path',
      codes: ['1', '2', '3'],
    },
  };
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
    isInternalScenario: false,
  };
  let mockNavigationOptions = {
    isInternalScenarioFinish: false,
    url: '',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        LocationService,
        WINDOW_PROVIDERS,
        SessionService,
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(FormPlayerApiService);
    configService = TestBed.inject(ConfigService);
    initDataService = TestBed.inject(InitDataService);
    initDataService.targetId = targetId;
    initDataService.orderId = orderId;
    initDataService.serviceId = serviceId;
    initDataService.serviceInfo = serviceInfo;
    initDataService.gepsId = gepsId;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(waitForAsync(() => http.verify()));

  describe('checkIfOrderExist()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.checkIfOrderExist().subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service.checkIfOrderExist().subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/checkIfOrderIdExists`);
      const body = req.request.body;
      expect(body).toEqual({ targetId });
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getOrderStatus()', () => {
    it('should call http with post method', fakeAsync(() => {
      service.getOrderStatus(orderId).subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getOrderStatus`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      service.getOrderStatus(orderId).subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getOrderStatus`);
      const body = req.request.body;
      expect(body).toEqual({ targetId, orderId });
      req.flush(responseMock);
      tick();
    }));
  });

  describe('quizToOrder()', () => {
    it('should call http with post method', fakeAsync(() => {
      const quiz = { ...mockData, serviceId: '', targetId: '', answerServicePrefix: '' };
      service.quizToOrder(quiz).subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/quiz/scenario/toOrder`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call with body', fakeAsync(() => {
      const quiz = { ...mockData, serviceId: '', targetId: '', answerServicePrefix: '' };
      service.quizToOrder(quiz).subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/quiz/scenario/toOrder`);
      const body = req.request.body;
      expect(body).toEqual(quiz);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getServiceData()', () => {
    let req;
    beforeEach(fakeAsync(() => {
      service.getServiceData(orderId).subscribe((response) => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
    }));

    afterEach(fakeAsync(() => {
      req.flush(responseMock);
      tick();
    }));

    it('should call http with post method', fakeAsync(() => {
      expect(req.request.method).toBe('POST');
    }));

    it('should call with body without orderId', fakeAsync(() => {
      service.getServiceData().subscribe((response) => expect(response).toBe(responseMock));
      req = http.expectOne(`${apiUrl}/service/${serviceId}/scenario/getService`);
      const body = req.request.body;
      expect(body.orderId).toBeUndefined();
    }));

    it('should call with body with orderId', fakeAsync(() => {
      const body = req.request.body;
      expect(body.orderId).toEqual(orderId);
    }));

    it('should call with body with targetId', fakeAsync(() => {
      const body = req.request.body;
      expect(body.targetId).toEqual(targetId);
    }));

    it('should call with body with serviceInfo', fakeAsync(() => {
      const body = req.request.body;
      expect(body.serviceInfo).toEqual(serviceInfo);
    }));

    it('should call with body with gepsId', fakeAsync(() => {
      const body = req.request.body;
      expect(body.gepsId).toEqual(gepsId);
    }));

    it('should call http post with withCredentials equal true', fakeAsync(() => {
      const withCredentials = req.request.withCredentials;
      expect(withCredentials).toBe(true);
    }));
  });

  describe('navigate()', () => {
    it('should call http with post method', fakeAsync(() => {
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.NEXT)
        .subscribe((response) => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getNextStep path', fakeAsync(() => {
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.NEXT)
        .subscribe((response) => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with getPrevStep path', fakeAsync(() => {
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe((response) => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush(responseMock);
      tick();
    }));

    it('shouldn\'t return scenarioDto with isPrevStepCase', fakeAsync(() => {
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.NEXT)
        .subscribe((response) =>
          expect(
            (response as FormPlayerApiSuccessResponse).scenarioDto.isPrevStepCase,
          ).toBeUndefined(),
        );
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.NEXT}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush({ ...mockData });
      tick();
    }));

    it('should return scenarioDto with isPrevStepCase property and true value', fakeAsync(() => {
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe((response) =>
          expect(
            (response as FormPlayerApiSuccessResponse).scenarioDto.isPrevStepCase,
          ).toBeTruthy(),
        );
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.url).toBe(url);
      req.flush({ ...mockData });
      tick();
    }));

    it('should call http with body', fakeAsync(() => {
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe((response) => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}`;
      const req = http.expectOne(url);
      expect(req.request.body).toEqual(mockData);
      req.flush(responseMock);
      tick();
    }));

    it('should call http with params', fakeAsync(() => {
      let mockNavigationOptions = {
        params: { stepsBack: 2 },
      };
      service
        .navigate(mockData, mockNavigationOptions, FormPlayerNavigation.PREV)
        .subscribe((response) => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/${serviceId}/scenario/${FormPlayerNavigation.PREV}?stepsBack=2`;
      const req = http.expectOne(url);
      expect(req.request.params.has('stepsBack')).toBeTruthy();
      req.flush(responseMock);
      tick();
    }));
  });

  describe('sendAction()', () => {
    it('should call http with post method', fakeAsync(() => {
      const path = 'editPhoneNumber';
      const responseMockData = {};

      service
        .sendAction(path, mockData)
        .subscribe((response) => expect(response).toBe(responseMockData));
      const req = http.expectOne(`${apiUrl}/${path}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMockData);
      tick();
    }));
  });

  describe('getBooking()', () => {
    it('should call http with post method', fakeAsync(() => {
      const path = 'service/booking';
      const responseMockData = {};

      service.getBooking().subscribe((response) => expect(response).toBe(responseMockData));
      const req = http.expectOne(`${apiUrl}/${path}`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMockData);
      tick();
    }));

    it('should call http with body', fakeAsync(() => {
      service.getBooking().subscribe((response) => expect(response).toBe(responseMock));
      const url = `${apiUrl}/service/booking`;
      const req = http.expectOne(url);
      const body = {
        serviceId,
        parentOrderId: orderId,
      };
      expect(req.request.body).toEqual(body);
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getQuizData()', () => {
    it('should call http with get method', fakeAsync(() => {
      const apiUrl = configService.quizDataApiUrl;
      const responseMockData = {};

      service.getQuizData().subscribe((response) => expect(response).toBe(responseMockData));
      const req = http.expectOne(`${apiUrl}?userId=`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMockData);
      tick();
    }));

    it('should call http with userId as params', fakeAsync(() => {
      service.getQuizData().subscribe((response) => expect(response).toBe(responseMock));
      const apiUrl = configService.quizDataApiUrl;
      const req = http.expectOne(`${apiUrl}?userId=`);
      expect(req.request.urlWithParams.includes('userId')).toBeTruthy();
      req.flush(responseMock);
      tick();
    }));
  });

  describe('getQuizDataByToken()', () => {
    it('should call http with get method', fakeAsync(() => {
      const apiUrl = configService.quizDataApiUrl;
      const token = 'token';
      const responseMockData = {};

      service
        .getQuizDataByToken(token)
        .subscribe((response) => expect(response).toBe(responseMockData));
      const req = http.expectOne(`${apiUrl}/${token}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMockData);
      tick();
    }));

    it('should call http with token passed', fakeAsync(() => {
      const apiUrl = configService.quizDataApiUrl;
      const token = 'token';

      service
        .getQuizDataByToken(token)
        .subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`${apiUrl}/${token}`);
      expect(req.request.urlWithParams.includes(token)).toBeTruthy();
      req.flush(responseMock);
      tick();
    }));
  });
});
