import { TestBed } from '@angular/core/testing';

import { FormPlayerStartManager } from './form-player-start.manager';
import { FormPlayerNavigation, ServiceEntity } from '../../form-player.types';
import { of } from 'rxjs';
import {
  LAST_SCENARIO_KEY,
  NEXT_SCENARIO_KEY, ORDER_TO_ORDER_SCENARIO_KEY,
  QUIZ_SCENARIO_KEY,
} from '../../../shared/constants/form-player';
import { FormPlayerServiceStub } from '../form-player/form-player.service.stub';
import { LoadService } from '@epgu/epgu-lib';
import { LoadServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerService } from '../form-player/form-player.service';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { ContinueOrderModalService } from '../../../modal/continue-order-modal/continue-order-modal.service';
import { InitDataServiceStub } from '../../../core/services/init-data/init-data.service.stub';
import { ContinueOrderModalServiceStub } from '../../../modal/continue-order-modal/continue-order-modal.service.stub';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { Location } from '@angular/common';
import { LocationService, WINDOW_PROVIDERS, LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { APP_OUTPUT_KEY } from '@epgu/epgu-constructor-types';

const responseDto = new FormPlayerServiceStub()._store;

describe('FormPlayerStartManager', () => {
  let service: FormPlayerStartManager;
  let formPlayerService: FormPlayerService;
  let localStorageService: LocalStorageService;
  let loadService: LoadService;
  let loggerService: LoggerService;
  let continueOrderModalService: ContinueOrderModalService;
  let initDataService: InitDataService;
  let location: Location;

  let serviceDataMock: ServiceEntity = {
    serviceId: '10000100',
    targetId: '-10000100',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerStartManager,
        UnsubscribeService,
        WINDOW_PROVIDERS,
        LocationService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
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
    continueOrderModalService = TestBed.inject(ContinueOrderModalService);
    localStorageService = TestBed.inject(LocalStorageService);
    loadService = TestBed.inject(LoadService);
    loggerService = TestBed.inject(LoggerService);
    initDataService = TestBed.inject(InitDataService);
    location = TestBed.inject(Location);
  });

  describe('startPlayer()', () => {
    const rawSate = JSON.stringify(responseDto);

    it('should call startScenarioFromProps case', () => {
      initDataService.init({ ...serviceDataMock }, { initState: rawSate });
      spyOn<any>(service, 'startScenarioFromProps').and.callThrough();
      service.startPlayer();
      expect(service['startScenarioFromProps']).toBeCalled();
    });

    it('should call hasLoadFromStorageCase case', () => {
      initDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'hasLoadFromStorageCase').and.callThrough();
      service.startPlayer();
      expect(service['hasLoadFromStorageCase']).toBeCalled();
    });

    it('should call hasLoadFromStorageCase case', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(LAST_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadLastScreenCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadLastScreenCase']).toBeCalled();
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should call startLoadNextScreenCase case', () => {
      location.go('/some-page', 'getNextScreen=true');
      localStorage.setItem(NEXT_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadNextScreenCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadNextScreenCase']).toBeCalled();
      localStorage.removeItem(NEXT_SCENARIO_KEY);
    });

    it('should call startLoadFromQuizCase case', () => {
      location.go('/some-page', 'fromQuiz=true');
      localStorage.setItem(QUIZ_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadFromQuizCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadFromQuizCase']).toBeCalled();
      localStorage.removeItem(QUIZ_SCENARIO_KEY);
    });

    it('should call startLoadFromOrderCase case', () => {
      location.go('/some-page', 'fromOrder=true');
      localStorage.setItem(ORDER_TO_ORDER_SCENARIO_KEY, rawSate);
      initDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadFromOrderCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadFromOrderCase']).toBeCalled();
      localStorage.removeItem(ORDER_TO_ORDER_SCENARIO_KEY);
    });

    it('should call handleOrder case', () => {
      initDataService.init({
        ...serviceDataMock,
        orderId: '2145',
        canStartNew: true,
        invited: false,
      });
      spyOn<any>(service, 'handleOrder').and.callThrough();
      service.startPlayer();
      expect(service['handleOrder']).toBeCalled();
    });

    it('should call getOrderStatus case', () => {
      initDataService.init({ ...serviceDataMock, orderId: '2145' });
      spyOn<any>(service, 'handleOrder').and.callThrough();
      service.startPlayer();
      expect(service['handleOrder']).toBeCalled();
    });

    it('should call getOrderIdFromApi case', () => {
      initDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'getOrderIdFromApi').and.callThrough();
      service.startPlayer();
      expect(service['getOrderIdFromApi']).toBeCalled();
    });
  });

  describe('startScenarioFromProps()', () => {
    const rawSate = JSON.stringify(responseDto);

    it('should call log of loggerService', () => {
      spyOn(loggerService, 'log').and.callThrough();
      service['startScenarioFromProps'](rawSate);
      expect(loggerService.log).toBeCalled();
    });

    it('should call loadStoreAndNavigate', () => {
      spyOn<any>(service, 'loadStoreAndNavigate').and.callThrough();
      service['startScenarioFromProps'](rawSate);
      expect(service['loadStoreAndNavigate']).toBeCalledWith(responseDto);
    });
  });

  describe('loadStoreAndNavigate()', () => {
    const rawSate = JSON.stringify(responseDto);

    it('should set store to formPlayerService', () => {
      const setterSpy = jest.spyOn(formPlayerService, 'store', 'set');
      service['loadStoreAndNavigate'](responseDto);
      expect(setterSpy).toBeCalledWith(responseDto);
    });

    it('should call navigate of formPlayerService', () => {
      spyOn(formPlayerService, 'navigate').and.callThrough();
      service['loadStoreAndNavigate'](responseDto);
      const payload = responseDto.scenarioDto.currentValue;
      expect(formPlayerService.navigate).toBeCalledWith({ payload }, FormPlayerNavigation.NEXT);
    });
  });

  describe('getOrderStatus()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true,
    };

    it('should call invited of initDataService', () => {
      spyOn(formPlayerService, 'getOrderStatus').and.returnValue(of(checkIfOrderExistResult));
      initDataService.init({ ...serviceDataMock, orderId: '123456' });
      spyOn<any>(service, 'handleOrderDataResponse');
      service['getOrderStatus']();
      expect(service['handleOrderDataResponse']).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('getOrderIdFromApi()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true,
    };

    it('should call invited of initDataService', () => {
      spyOn(formPlayerService, 'checkIfOrderExist').and.returnValue(of(checkIfOrderExistResult));
      spyOn<any>(service, 'handleOrderDataResponse');
      service['getOrderIdFromApi']();
      expect(service['handleOrderDataResponse']).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('handleOrderDataResponse()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true,
    };

    it('should call invited of initDataService', () => {
      const spySetter = jest.spyOn(initDataService, 'invited', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.isInviteScenario);
    });

    it('should call orderId of initDataService', () => {
      const spySetter = jest.spyOn(initDataService, 'orderId', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.orderId);
    });

    it('should call canStartNew of initDataService', () => {
      const spySetter = jest.spyOn(initDataService, 'canStartNew', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.canStartNew);
    });

    it('should call handleOrder', () => {
      spyOn<any>(service, 'handleOrder').and.callThrough();
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(service['handleOrder']).toBeCalledWith(
        checkIfOrderExistResult.orderId,
        checkIfOrderExistResult.isInviteScenario,
        checkIfOrderExistResult.canStartNew,
      );
    });
  });

  describe('handleOrder()', () => {
    const orderId = '1234';
    const invited = false;
    const canStartNew = true;

    it('should call shouldShowContinueOrderModal', () => {
      spyOn<any>(service, 'shouldShowContinueOrderModal').and.callThrough();
      service['handleOrder'](orderId, invited, canStartNew);
      expect(service['shouldShowContinueOrderModal']).toBeCalledWith(orderId, invited, canStartNew);
    });

    it('should call showContinueOrderModal when shouldShowContinueOrderModal return true', () => {
      spyOn<any>(service, 'shouldShowContinueOrderModal').and.returnValue(true);
      spyOn<any>(service, 'showContinueOrderModal').and.callThrough();
      service['handleOrder'](orderId, invited, canStartNew);
      expect(service['showContinueOrderModal']).toBeCalled();
    });

    it('should call initData of formPlayerService when shouldShowContinueOrderModal return false', () => {
      spyOn<any>(service, 'shouldShowContinueOrderModal').and.returnValue(false);
      spyOn(formPlayerService, 'initData').and.callThrough();
      spyOn(localStorageService, 'set').and.callThrough();
      service['handleOrder'](orderId, invited, canStartNew);
      expect(formPlayerService.initData).toBeCalledWith(orderId);
      expect(localStorageService.set).toBeCalledWith('cachedAnswers', {});
    });
  });

  describe('shouldShowContinueOrderModal()', () => {
    const orderId = 1234;
    const invited = false;
    const canStartNew = true;

    it('should return true if not invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orderId,
        invited,
        canStartNew,
      );
      expect(shouldShowContinueOrderModal).toBe(true);
    });

    it('should return false if lib output case', () => {
      localStorage.setItem(APP_OUTPUT_KEY, '{}');
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orderId,
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
        orderId,
        invited,
        canStartNew,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should return false if not invited, canStartNew, empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        null,
        invited,
        canStartNew,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orderId,
        true,
        canStartNew,
      );
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if not invited, not canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](
        orderId,
        invited,
        false,
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
      spyOn(continueOrderModalService, 'openModal').and.callThrough();
      service['showContinueOrderModal']();
      expect(continueOrderModalService.openModal).toBeCalled();
    });

    it('should call initData of formPlayerService with orderId', () => {
      const orderId = '1234';
      spyOn(continueOrderModalService, 'openModal').and.returnValue(of(true));
      initDataService.orderId = orderId;
      spyOn(formPlayerService, 'initData').and.callThrough();
      service['showContinueOrderModal']();
      expect(formPlayerService.initData).toBeCalledWith(orderId);
    });

    it('should call initData of formPlayerService without orderId', () => {
      spyOn(continueOrderModalService, 'openModal').and.returnValue(of(false));
      spyOn(formPlayerService, 'initData').and.callThrough();
      service['showContinueOrderModal']();
      expect(formPlayerService.initData).toBeCalledWith(null);
    });
  });

  describe('startBookingCase()', () => {
    it('should call getBooking of formPlayerService', () => {
      spyOn(formPlayerService, 'getBooking').and.callThrough();
      service['startBookingCase']();
      expect(formPlayerService.getBooking).toBeCalled();
    });
  });
});
