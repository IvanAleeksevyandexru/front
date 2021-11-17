import { TestBed } from '@angular/core/testing';
import { FormPlayerStartManager } from './form-player-start.manager';
import { FormPlayerNavigation, ServiceEntity } from '../../form-player.types';
import { of } from 'rxjs';
import {
  LAST_SCENARIO_KEY,
  NEXT_SCENARIO_KEY,
  ORDER_TO_ORDER_SCENARIO_KEY,
  QUIZ_SCENARIO_KEY,
} from '../../../shared/constants/form-player';
import { FormPlayerServiceStub } from '../form-player/form-player.service.stub';
import { LoadService } from '@epgu/ui/services/load';
import {
  LoggerService,
  LoggerServiceStub,
  UnsubscribeService,
  ConfigService,
  ConfigServiceStub,
  LoadServiceStub,
  LocationService,
  WINDOW_PROVIDERS,
  LocalStorageService,
  LocalStorageServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerService } from '../form-player/form-player.service';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { ContinueOrderModalService } from '../../../modal/continue-order-modal/continue-order-modal.service';
import { InitDataServiceStub } from '../../../core/services/init-data/init-data.service.stub';
import { ContinueOrderModalServiceStub } from '../../../modal/continue-order-modal/continue-order-modal.service.stub';
import { Location } from '@angular/common';
import { cloneDeep } from 'lodash';
import { OrderDto, APP_OUTPUT_KEY, CheckOrderApiResponse } from '@epgu/epgu-constructor-types';
import { FormPlayerApiServiceStub } from '../form-player-api/form-player-api.service.stub';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';

const responseDto = new FormPlayerServiceStub()._store;

describe('FormPlayerStartManager', () => {
  let service: FormPlayerStartManager;
  let formPlayerService: FormPlayerService;
  let formPlayerApiService: FormPlayerApiService;
  let localStorageService: LocalStorageService;
  let loggerService: LoggerService;
  let continueOrderModalService: ContinueOrderModalService;
  let initDataService: InitDataService;
  let location: Location;
  let locationService: LocationService;

  let serviceDataMock: ServiceEntity = {
    serviceId: '10000100',
    targetId: '-10000100',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerStartManager,
        UnsubscribeService,
        WINDOW_PROVIDERS,
        LocationService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ContinueOrderModalService, useClass: ContinueOrderModalServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(FormPlayerStartManager);
    formPlayerService = TestBed.inject(FormPlayerService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    continueOrderModalService = TestBed.inject(ContinueOrderModalService);
    localStorageService = TestBed.inject(LocalStorageService);
    loggerService = TestBed.inject(LoggerService);
    initDataService = TestBed.inject(InitDataService);
    location = TestBed.inject(Location);
    locationService = TestBed.inject(LocationService);
  });

  describe('startPlayer()', () => {
    const rawSate = JSON.stringify(responseDto);

    it('should call startScenarioFromProps case', () => {
      initDataService.init({ ...serviceDataMock }, { initState: rawSate });
      const spy = jest.spyOn<any, string>(service, 'startScenarioFromProps');
      service.startPlayer();
      expect(spy).toBeCalled();
    });

    it('should call hasLoadFromStorageCase case', () => {
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'hasLoadFromStorageCase');
      service.startPlayer();
      expect(spy).toBeCalled();
    });

    it('should call hasLoadFromStorageCase case', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(LAST_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'startLoadLastScreenCase');
      service.startPlayer();
      expect(spy).toBeCalled();
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should call startLoadNextScreenCase case', () => {
      location.go('/some-page', 'getNextScreen=true');
      localStorage.setItem(NEXT_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'startLoadNextScreenCase');
      service.startPlayer();
      expect(spy).toBeCalled();
      localStorage.removeItem(NEXT_SCENARIO_KEY);
    });

    it('should call startLoadFromQuizCase case', () => {
      location.go('/some-page', 'fromQuiz=true&token=459tudsvdsvb');
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'startLoadFromQuizCaseByToken');
      service.startPlayer();
      expect(spy).toBeCalled();
    });

    it('should call startLoadFromQuizCase case', () => {
      location.go('/some-page', 'fromQuiz=true');
      localStorage.setItem(QUIZ_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'startLoadFromQuizCase');
      service.startPlayer();
      expect(spy).toBeCalled();
      localStorage.removeItem(QUIZ_SCENARIO_KEY);
    });

    it('should call startLoadFromOrderCase case', () => {
      location.go('/some-page', 'fromOrder=true');
      localStorage.setItem(ORDER_TO_ORDER_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'startLoadFromOrderCase');
      service.startPlayer();
      expect(spy).toBeCalled();
      localStorage.removeItem(ORDER_TO_ORDER_SCENARIO_KEY);
    });

    it('should call handleOrder case', () => {
      initDataService.init({
        ...serviceDataMock,
        orderId: 2145,
        canStartNew: true,
        invited: false,
      });
      const spy = jest.spyOn<any, string>(service, 'handleOrder');
      service.startPlayer();
      expect(spy).toBeCalled();
    });

    it('should call getOrderStatus case', () => {
      initDataService.init({ ...serviceDataMock, orderId: 2145 });
      const spy = jest.spyOn<any, string>(service, 'handleOrder');
      service.startPlayer();
      expect(spy).toBeCalled();
    });

    it('should call getOrderIdFromApi case', () => {
      initDataService.init({ ...serviceDataMock });
      const spy = jest.spyOn<any, string>(service, 'getOrderIdFromApi');
      service.startPlayer();
      expect(spy).toBeCalled();
    });
  });

  describe('startScenarioFromProps()', () => {
    const rawSate = JSON.stringify(responseDto);

    it('should call log of loggerService', () => {
      const spy = jest.spyOn(loggerService, 'log');
      service['startScenarioFromProps'](rawSate);
      expect(spy).toBeCalled();
    });

    it('should call loadStoreAndNavigate', () => {
      const spy = jest.spyOn<any, string>(service, 'loadStoreAndNavigate');
      service['startScenarioFromProps'](rawSate);
      expect(spy).toBeCalledWith(responseDto);
    });
  });

  describe('loadStoreAndNavigate()', () => {
    it('should set store to formPlayerService', () => {
      const setterSpy = jest.spyOn(formPlayerService, 'store', 'set');
      service['loadStoreAndNavigate'](responseDto);
      expect(setterSpy).toBeCalledWith(responseDto);
    });

    it('should call navigate of formPlayerService', () => {
      const spy = jest.spyOn(formPlayerService, 'navigate');
      service['loadStoreAndNavigate'](responseDto);
      const payload = responseDto.scenarioDto.currentValue;
      expect(spy).toBeCalledWith({ payload }, FormPlayerNavigation.NEXT);
    });
  });

  describe('getOrderStatus()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true,
    };

    it('should call invited of initDataService', () => {
      jest.spyOn(formPlayerService, 'getOrderStatus').mockReturnValue(of(checkIfOrderExistResult));
      initDataService.init({ ...serviceDataMock, orderId: 123456 });
      const spy = jest.spyOn<any, string>(service, 'handleOrderDataResponse');
      service['getOrderStatus']();
      expect(spy).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('getOrderIdFromApi()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true,
    };

    it('should call invited of initDataService', () => {
      jest.spyOn(formPlayerService, 'checkIfOrderExist').mockReturnValue(of(checkIfOrderExistResult));
      const spy = jest.spyOn<any, string>(service, 'handleOrderDataResponse');
      service['getOrderIdFromApi']();
      expect(spy).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('handleOrderDataResponse()', () => {
    const checkIfOrderExistResult = {
      isInviteScenario: false,
      canStartNew: true,
      limitOrders: 1,
      inviteByOrderId: 123456,
      startNewBlockedByOrderId: 123456,
      orders: [
        {
          orderId: 123456,
        },
      ],
    } as CheckOrderApiResponse;

    it('should call invited of initDataService', () => {
      const spySetter = jest.spyOn(initDataService, 'invited', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.isInviteScenario);
    });

    it('should call orderId of initDataService', () => {
      const spySetter = jest.spyOn(initDataService, 'orderId', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.orders[0].orderId);
    });

    it('should call canStartNew of initDataService', () => {
      const spySetter = jest.spyOn(initDataService, 'canStartNew', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.canStartNew);
    });

    it('should call handleOrder', () => {
      const spy = jest.spyOn<any, string>(service, 'handleOrder');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spy).toBeCalledWith(
        checkIfOrderExistResult.orders,
        checkIfOrderExistResult.isInviteScenario,
        checkIfOrderExistResult.canStartNew,
        checkIfOrderExistResult.limitOrders,
        checkIfOrderExistResult.inviteByOrderId,
        checkIfOrderExistResult.startNewBlockedByOrderId,
      );
    });
  });

  describe('handleOrder()', () => {
    const orders = [
      {
        orderId: 123456,
      },
    ] as OrderDto[];
    const invited = false;
    const canStartNew = true;
    const inviteByOrderId = undefined;
    const startNewBlockedByOrderId = undefined;

    it('should call shouldShowContinueOrderModal', () => {
      const spy = jest.spyOn<any, string>(service, 'shouldShowContinueOrderModal');
      service['handleOrder'](
        orders,
        invited,
        canStartNew,
        inviteByOrderId,
        startNewBlockedByOrderId,
      );
      expect(spy).toBeCalledWith(
        orders,
        invited,
        canStartNew,
        inviteByOrderId,
        startNewBlockedByOrderId,
      );
    });

    it('should call showContinueOrderModal when shouldShowContinueOrderModal return true', () => {
      jest.spyOn<any, string>(service, 'shouldShowContinueOrderModal').mockReturnValue(true);
      const spy = jest.spyOn<any, string>(service, 'showContinueOrderModal');
      service['handleOrder'](orders, invited, canStartNew);
      expect(spy).toBeCalled();
    });

    it('should call initData of formPlayerService when shouldShowContinueOrderModal return false', () => {
      jest.spyOn<any, string>(service, 'shouldShowContinueOrderModal').mockReturnValue(false);
      const spyInitData = jest.spyOn(formPlayerService, 'initData');
      const spySet = jest.spyOn(localStorageService, 'set');
      service['handleOrder'](orders, invited, canStartNew);
      expect(spyInitData).toBeCalledWith(orders[0].orderId);
      expect(spySet).toBeCalledWith('cachedAnswers', {});
    });
  });

  describe('startLoadFromQuizCaseByToken()', () => {
    it('should call getQuizDataByToken with token', () => {
      const token = 'some cool token';
      jest.spyOn(locationService, 'getParamValue').mockReturnValue(token);
      const spy = jest.spyOn(formPlayerService, 'getQuizDataByToken');
      service['startLoadFromQuizCaseByToken']();
      expect(spy).toBeCalledWith(token);
    });

    it('should call startLoadFromQuizCase with scenarioDto that return getQuizDataByToken', () => {
      const token = 'some cool token';
      const scenarioDto = {};
      jest.spyOn(locationService, 'getParamValue').mockReturnValue(token);
      jest.spyOn(formPlayerService, 'getQuizDataByToken').mockReturnValue(
        //  @ts-ignore
        of({
          data: {
            order: JSON.stringify(scenarioDto),
          },
        }),
      );
      const spy = jest.spyOn<any, string>(service, 'loadOrderFromQuiz');
      service['startLoadFromQuizCaseByToken']();
      expect(spy).toBeCalledWith(scenarioDto);
    });
  });

  describe('shouldShowContinueOrderModal()', () => {
    const orders = [
      {
        orderId: 123456,
      },
    ] as OrderDto[];
    const invited = false;
    const canStartNew = true;
    const inviteByOrderId = undefined;
    const startNewBlockedByOrderId = undefined;

    it('should return true if not invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orders,
        invited,
        canStartNew,
      );
      expect(shouldShowContinueOrderModal).toBe(true);
    });

    it('should return false if lib output case', () => {
      localStorage.setItem(APP_OUTPUT_KEY, '{}');
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orders,
        invited,
        canStartNew,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
      localStorage.removeItem(APP_OUTPUT_KEY);
    });

    it('should return false if not invited, canStartNew, not empty orderId, isNeedToShowLastScreen', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(LAST_SCENARIO_KEY, JSON.stringify(responseDto));
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orders,
        invited,
        canStartNew,
        inviteByOrderId,
        startNewBlockedByOrderId,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should return false if not invited, canStartNew, empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        null,
        invited,
        canStartNew,
        inviteByOrderId,
        startNewBlockedByOrderId,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orders,
        true,
        canStartNew,
        inviteByOrderId,
        startNewBlockedByOrderId,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if not invited, not canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orders,
        invited,
        false,
        inviteByOrderId,
        123456,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
    });
  });

  describe('hasLoadFromStorageCase()', () => {
    it('should return true', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(LAST_SCENARIO_KEY, '{}');
      expect(service['hasLoadFromStorageCase']('getLastScreen', LAST_SCENARIO_KEY)).toBeTruthy();
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should return false', () => {
      expect(service['hasLoadFromStorageCase']('getLastScreen', LAST_SCENARIO_KEY)).toBeFalsy();
    });
  });

  describe('showContinueOrderModal()', () => {
    it('should call openModal of continueOrderModalService', () => {
      const spy = jest.spyOn(continueOrderModalService, 'openModal');
      service['showContinueOrderModal']();
      expect(spy).toBeCalled();
    });

    it('should call initData of formPlayerService with orderId', () => {
      const orderId = 1234;
      jest.spyOn(continueOrderModalService, 'openModal').mockReturnValue(of(true));
      initDataService.orderId = orderId;
      const spy = jest.spyOn(formPlayerService, 'initData');
      service['showContinueOrderModal']();
      expect(spy).toBeCalledWith(orderId);
    });

    it('should call initData of formPlayerService without orderId', () => {
      jest.spyOn(continueOrderModalService, 'openModal').mockReturnValue(of(false));
      const spy = jest.spyOn(formPlayerService, 'initData');
      service['showContinueOrderModal']();
      expect(spy).toBeCalledWith(null);
    });
  });

  describe('startBookingCase()', () => {
    it('should call getBooking of formPlayerService', () => {
      const spy = jest.spyOn(formPlayerService, 'getBooking');
      service['startBookingCase']();
      expect(spy).toBeCalled();
    });
  });

  describe('startFromQueryParamsCase()', () => {
    const rawState = JSON.stringify(responseDto);

    it('should call formPlayerApiService.post()', () => {
      const spy = jest.spyOn(formPlayerApiService, 'post');
      service['startFromQueryParamsCase']();
      expect(spy).toBeCalled();
    });

    it('should call formPlayerService.processResponse()', () => {
      const spy = jest.spyOn(formPlayerService, 'processResponse');
      service['startFromQueryParamsCase']();
      expect(spy).toBeCalled();
    });

    it('should prepare valid path and payload for POST request', () => {
      const path = '/api/service/10000100/scenario/external';
      const payload = {
        answers: { q1: 'value' },
        screenId: 's1',
        serviceId: '10000100',
        targetId: '-10000100',
      };
      const spy = jest.spyOn(formPlayerApiService, 'post');
      const newServiceDataMock = cloneDeep(serviceDataMock);
      // @ts-ignore
      newServiceDataMock.serviceInfo = {
        queryParams: { external: '', screenId: 's1', q1: 'value' },
      };
      initDataService.init({ ...newServiceDataMock }, { initState: rawState });
      service['startFromQueryParamsCase']();
      expect(spy).toHaveBeenCalledWith(path, payload);
    });
  });

  describe('hasSpecificQueryParams()', () => {
    const rawSate = JSON.stringify(responseDto);
    it('should return true, if initDataService contain external, serviceId, targetId, screenId in queryParams', () => {
      const newServiceDataMock = cloneDeep(serviceDataMock);
      // @ts-ignore
      newServiceDataMock.serviceInfo = {
        queryParams: { external: '', screenId: 's1', q1: 'value' },
      };
      initDataService.init({ ...newServiceDataMock }, { initState: rawSate });
      const result = service['hasSpecificQueryParams']();
      expect(result).toBeTruthy();
    });
    it('should return false, if initDataService does not contain serviceId, targetId or screenId in queryParams', () => {
      const rawSate = JSON.stringify(responseDto);
      initDataService.init({ ...serviceDataMock }, { initState: rawSate });
      const result = service['hasSpecificQueryParams']();
      expect(result).toBeFalsy();
    });
  });
});
