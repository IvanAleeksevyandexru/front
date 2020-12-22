import { TestBed } from '@angular/core/testing';

import { FormPlayerStartService } from './form-player-start.service';
import { FormPlayerComponent } from '../../form-player.component';
import { FormPlayerNavigation, Service } from '../../form-player.types';
import { of } from 'rxjs';
import { LAST_SCENARIO_KEY, NEXT_SCENARIO_KEY, QUIZ_SCENARIO_KEY } from '../../../shared/constants/form-player';
import { FormPlayerServiceStub } from '../form-player/form-player.service.stub';
import { LoadService } from 'epgu-lib';
import { LoadServiceStub } from '../../../core/config/load-service-stub';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../core/services/logger/logger.service.stub';
import { FormPlayerService } from '../form-player/form-player.service';
import { ServiceDataService } from '../service-data/service-data.service';
import { FormPlayerConfigApiService } from '../form-player-config-api/form-player-config-api.service';
import { ConfigService } from '../../../core/config/config.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../screen/screen.service';
import { ContinueOrderModalService } from '../../../modal/continue-order-modal/continue-order-modal.service';
import { ServiceDataServiceStub } from '../service-data/service-data.service.stub';
import { ContinueOrderModalServiceStub } from '../../../modal/continue-order-modal/continue-order-modal.service.stub';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Location } from '@angular/common';
import { WINDOW_PROVIDERS } from '../../../core/providers/window.provider';
import { LocationService } from '../../../core/services/location/location.service';

const responseDto = new FormPlayerServiceStub()._store;


describe('FormServiceStartService', () => {
  let service: FormPlayerStartService;
  let formPlayerService: FormPlayerService;
  let localStorageService: LocalStorageService;
  let loadService: LoadService;
  let loggerService: LoggerService;
  let continueOrderModalService: ContinueOrderModalService;
  let serviceDataService: ServiceDataService;
  let location: Location;

  let serviceDataMock: Service = {
    serviceId: '10000100',
    targetId: '-10000100'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerStartService,
        UnsubscribeService,
        WINDOW_PROVIDERS,
        LocationService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ContinueOrderModalService, useClass: ContinueOrderModalServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ServiceDataService, useClass: ServiceDataServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerStartService);
  });

  beforeEach(() => {
    service = TestBed.inject(FormPlayerStartService);
    formPlayerService = TestBed.inject(FormPlayerService);
    continueOrderModalService = TestBed.inject(ContinueOrderModalService);
    localStorageService = TestBed.inject(LocalStorageService);
    loadService = TestBed.inject(LoadService);
    loggerService = TestBed.inject(LoggerService);
    serviceDataService = TestBed.inject(ServiceDataService);
    location = TestBed.inject(Location);
  });

  describe('startPlayer()', () => {
    const rawSate = JSON.stringify(responseDto);

    it('should call startScenarioFromProps case', () => {
      serviceDataService.init({ ...serviceDataMock, initState: rawSate });
      spyOn<any>(service, 'startScenarioFromProps').and.callThrough();
      service.startPlayer();
      expect(service['startScenarioFromProps']).toBeCalled();
    });

    it('should call hasLoadFromStorageCase case', () => {
      serviceDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'hasLoadFromStorageCase').and.callThrough();
      service.startPlayer();
      expect(service['hasLoadFromStorageCase']).toBeCalled();
    });

    it('should call hasLoadFromStorageCase case', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(LAST_SCENARIO_KEY, rawSate);
      serviceDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadLastScreenCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadLastScreenCase']).toBeCalled();
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should call startLoadNextScreenCase case', () => {
      location.go('/some-page', 'getNextScreen=true');
      localStorage.setItem(NEXT_SCENARIO_KEY, rawSate);
      serviceDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadNextScreenCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadNextScreenCase']).toBeCalled();
      localStorage.removeItem(NEXT_SCENARIO_KEY);
    });

    it('should call startLoadFromQuizCase case', () => {
      location.go('/some-page', 'fromQuiz=true');
      localStorage.setItem(QUIZ_SCENARIO_KEY, rawSate);
      serviceDataService.init({ ...serviceDataMock });
      spyOn<any>(service, 'startLoadFromQuizCase').and.callThrough();
      service.startPlayer();
      expect(service['startLoadFromQuizCase']).toBeCalled();
      localStorage.removeItem(QUIZ_SCENARIO_KEY);
    });

    it('should call handleOrder case', () => {
      serviceDataService.init({ ...serviceDataMock, orderId: '2145', canStartNew: true, invited: false });
      spyOn<any>(service, 'handleOrder').and.callThrough();
      service.startPlayer();
      expect(service['handleOrder']).toBeCalled();
    });

    it('should call getOrderStatus case', () => {
      serviceDataService.init({ ...serviceDataMock, orderId: '2145' });
      spyOn<any>(service, 'handleOrder').and.callThrough();
      service.startPlayer();
      expect(service['handleOrder']).toBeCalled();
    });

    it('should call getOrderIdFromApi case', () => {
      serviceDataService.init({ ...serviceDataMock });
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
      canStartNew: true
    };

    it('should call invited of serviceDataService', () => {
      spyOn(formPlayerService, 'getOrderStatus').and.returnValue(of(checkIfOrderExistResult));
      serviceDataService.init({ ...serviceDataMock, orderId: '123456' });
      spyOn<any>(service, 'handleOrderDataResponse');
      service['getOrderStatus']();
      expect(service['handleOrderDataResponse']).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('getOrderIdFromApi()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true
    };

    it('should call invited of serviceDataService', () => {
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
      canStartNew: true
    };

    it('should call invited of serviceDataService', () => {
      const spySetter = jest.spyOn(serviceDataService, 'invited', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.isInviteScenario);
    });

    it('should call orderId of serviceDataService', () => {
      const spySetter = jest.spyOn(serviceDataService, 'orderId', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.orderId);
    });

    it('should call canStartNew of serviceDataService', () => {
      const spySetter = jest.spyOn(serviceDataService, 'canStartNew', 'set');
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.canStartNew);
    });

    it('should call handleOrder', () => {
      spyOn<any>(service, 'handleOrder').and.callThrough();
      service['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(service['handleOrder']).toBeCalledWith(
        checkIfOrderExistResult.orderId,
        checkIfOrderExistResult.isInviteScenario,
        checkIfOrderExistResult.canStartNew
      );
    });
  });

  describe('handleOrder()', () => {
    const orderId = '1234';
    const invited = false;
    const canStartNew = true;

    it('should call shouldShowContinueOrderModal', () => {;
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
      service['handleOrder'](orderId, invited, canStartNew);
      expect(formPlayerService.initData).toBeCalledWith(orderId, invited);
    });
  });

  describe('shouldShowContinueOrderModal()', () => {
    const orderId = '1234';
    const invited = false;
    const canStartNew = true;

    it('should return true if not invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](orderId, invited, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(true);
    });

    it('should return false if not invited, canStartNew, not empty orderId, isNeedToShowLastScreen', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(LAST_SCENARIO_KEY, JSON.stringify(responseDto));
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](orderId, invited, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(false);
      localStorage.removeItem(LAST_SCENARIO_KEY);
    });

    it('should return false if not invited, canStartNew, empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](null, invited, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](orderId, true, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if not invited, not canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const shouldShowContinueOrderModal = service['shouldShowContinueOrderModal'](orderId, invited, false);
      expect(shouldShowContinueOrderModal).toBe(false);
    });
  });

  describe('hasLoadFromStorageCase()',() => {
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
      serviceDataService.orderId = orderId;
      spyOn(formPlayerService, 'initData').and.callThrough();
      service['showContinueOrderModal']();
      expect(formPlayerService.initData).toBeCalledWith(orderId, false);
    });

    it('should call initData of formPlayerService without orderId', () => {
      spyOn(continueOrderModalService, 'openModal').and.returnValue(of(false));
      spyOn(formPlayerService, 'initData').and.callThrough();
      service['showContinueOrderModal']();
      expect(formPlayerService.initData).toBeCalledWith(null, false);
    });
  });
});
