import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { LoadService } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { LoadServiceStub } from '../core/config/load-service-stub';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ModalContainerComponent } from '../modal/shared/modal-container/modal-container.component';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { LoggerService } from '../core/services/logger/logger.service';
import { LoggerServiceStub } from '../core/services/logger/logger.service.stub';
import { ScreenResolverComponent } from '../screen/screen-resolver/screen-resolver.component';
import { ScreenModalComponent } from '../modal/screen-modal/screen-modal.component';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../core/services/device-detector/device-detector.service.stub';
import { ServiceDataService } from './services/service-data/service-data.service';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { FormPlayerConfigApiServiceStub } from './services/form-player-config-api/form-player-config-api.service.stub';
import { NavigationServiceStub } from '../core/services/navigation/navigation.service.stub';
import { ConfigService } from '../core/config/config.service';
import { ConfigServiceStub } from '../core/config/config.service.stub';
import { ScreenService } from '../screen/screen.service';
import { ScreenServiceStub } from '../screen/screen.service.stub';
import { EpguLibModuleInited } from '../core/core.module';
import { ServiceDataServiceStub } from './services/service-data/service-data.service.stub';
import { FormPlayerNavigation, Service } from './form-player.types';
import { of } from 'rxjs';
import { ScreenTypes } from '../screen/screen.types';
import { ContinueOrderModalService } from '../modal/continue-order-modal/continue-order-modal.service';
import { ContinueOrderModalServiceStub } from '../modal/continue-order-modal/continue-order-modal.service.stub';
import { By } from '@angular/platform-browser';

const responseDto = new FormPlayerServiceStub()._store;

describe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let formPlayerConfigApiService: FormPlayerConfigApiService;
  let loadService: LoadService;
  let configService: ConfigService;
  let navService: NavigationService;
  let screenService: ScreenService;
  let loggerService: LoggerService;
  let continueOrderModalService: ContinueOrderModalService;
  let serviceDataService: ServiceDataService;
  let ScreenResolverComponentMock = MockComponent(ScreenResolverComponent);
  let ScreenModalComponentMock = MockComponent(ScreenModalComponent);
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);
  let serviceDataMock: Service = {
    serviceId: '10000100',
    targetId: '-10000100'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModuleInited,
      ],
      declarations: [
        FormPlayerComponent,
        ScreenResolverComponentMock,
        ModalContainerComponentMock,
        ScreenModalComponentMock,
      ],
      providers: [
        UnsubscribeService,
        { provide: ServiceDataService, useClass: ServiceDataServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerConfigApiService, useClass: FormPlayerConfigApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ContinueOrderModalService, useClass: ContinueOrderModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    formPlayerService = TestBed.inject(FormPlayerService);
    serviceDataService = TestBed.inject(ServiceDataService);
    formPlayerConfigApiService = TestBed.inject(FormPlayerConfigApiService);
    loadService = TestBed.inject(LoadService);
    configService = TestBed.inject(ConfigService);
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    loggerService = TestBed.inject(LoggerService);
    continueOrderModalService = TestBed.inject(ContinueOrderModalService);
  });

  describe('ngOnInit()', () => {
    it('should call init method of serviceDataService with service param', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn(serviceDataService, 'init').and.callThrough();
      component.ngOnInit();
      expect(serviceDataService.init).toBeCalledWith(serviceDataMock);
    });

    it('should call initFormPlayerConfig', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'initFormPlayerConfig').and.callThrough();
      component.ngOnInit();
      expect(component['initFormPlayerConfig']).toBeCalled();
    });

    it('should call initNavigation', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'initNavigation').and.callThrough();
      component.ngOnInit();
      expect(component['initNavigation']).toBeCalled();
    });

    it('should call initSettingOfScreenIdToAttr', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'initSettingOfScreenIdToAttr').and.callThrough();
      component.ngOnInit();
      expect(component['initSettingOfScreenIdToAttr']).toBeCalled();
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should call startPlayer', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'startPlayer').and.callThrough();
      component.ngAfterViewInit();
      expect(component['startPlayer']).toBeCalled();
    });
  });

  describe('ngOnChanges()', () => {
    it('should call init method of serviceDataService with service param', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn(serviceDataService, 'init').and.callThrough();
      component.ngOnChanges();
      expect(serviceDataService.init).toBeCalledWith(serviceDataMock);
    });
  });

  describe('initFormPlayerConfig()', () => {
    it('shouldn\'t call getFormPlayerConfig method of formPlayerConfigApiService when loadService not loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(false);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.callThrough();
      component['initFormPlayerConfig']();
      expect(formPlayerConfigApiService.getFormPlayerConfig).not.toBeCalled();
    });

    it('shouldn\'t call initCore method of configService when loadService not loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(false);
      spyOn(configService, 'initCore').and.callThrough();
      component['initFormPlayerConfig']();
      expect(configService.initCore).not.toBeCalled();
    });

    it('should call initCore method of configService when loadService has loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn(configService, 'initCore').and.callThrough();
      component['initFormPlayerConfig']();
      expect(configService.initCore).toBeCalled();
    });

    it('should call getFormPlayerConfig method of formPlayerConfigApiService when loadService has loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.callThrough();
      component['initFormPlayerConfig']();
      expect(formPlayerConfigApiService.getFormPlayerConfig).toBeCalled();
    });

    it('should call getResultConfig method twice when loadService has loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn<any>(component, 'getResultConfig').and.callThrough();
      component['initFormPlayerConfig']();
      expect(component['getResultConfig']).toBeCalledTimes(2);
    });

    it('should set form player config', () => {
      const config = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.returnValue(of(config));
      const setterSpy = jest.spyOn(configService, 'config', 'set');
      component['initFormPlayerConfig']();
      expect(setterSpy).toBeCalled();
    });
  });

  describe('getResultConfig()', () => {
    it('should return passed config when apiUrl service property is empty', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'nextStep').and.callThrough();
      const config = component['getResultConfig']();
      expect(config).toEqual({});
    });

    it('should return config with apiUrl when apiUrl service property has value', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, apiUrl: '/someApiUrl' };
      fixture.detectChanges();
      spyOn<any>(component, 'nextStep').and.callThrough();
      const config = component['getResultConfig']();
      expect(config).toEqual({ apiUrl: '/someApiUrl' });
    });
  });

  describe('initNavigation()', () => {
    it('should call nextStep with param when push nextStep navigation', () => {
      const navigationParam = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'nextStep').and.callThrough();
      navService.next(navigationParam);
      component['initNavigation']();
      expect(component['nextStep']).toBeCalledWith(navigationParam);
    });

    it('should call prevStep with param when push prevStep navigation', () => {
      const navigationParam = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'prevStep').and.callThrough();
      navService.prev(navigationParam);
      component['initNavigation']();
      expect(component['prevStep']).toBeCalledWith(navigationParam);
    });

    it('should call skipStep with param when push skipStep navigation', () => {
      const navigationParam = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn<any>(component, 'skipStep').and.callThrough();
      navService.skip(navigationParam);
      component['initNavigation']();
      expect(component['skipStep']).toBeCalledWith(navigationParam);
    });
  });

  describe('initSettingOfScreenIdToAttr()', () => {
    const display = {
      id: 's1',
      name: '',
      header: '',
      submitLabel: '',
      type: ScreenTypes.COMPONENT,
      terminal: false,
      components: []
    };

    it('should set screenId to component param', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      screenService.display = display;
      component['initSettingOfScreenIdToAttr']();
      expect(component.screenId).toBe(display.id);
    });

    it('should attr.test-screen-id be screenId', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      screenService.display = display;
      component['initSettingOfScreenIdToAttr']();
      fixture.detectChanges();
      expect(fixture.debugElement.attributes['test-screen-id']).toBe(display.id);
    });
  });


  describe('startPlayer()', () => {
    it('shouldn\'t trigger any start cases', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded.next(false);
      spyOn<any>(component, 'startScenarioFromProps').and.callThrough();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      spyOn<any>(component, 'getOrderStatus').and.callThrough();
      spyOn<any>(component, 'getOrderIdFromApi').and.callThrough();
      component['startPlayer']();
      expect(component['startScenarioFromProps']).not.toBeCalled();
      expect(component['handleOrder']).not.toBeCalled();
      expect(component['getOrderStatus']).not.toBeCalled();
      expect(component['getOrderIdFromApi']).not.toBeCalled();
    });

    it('should call startScenarioFromProps case', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, initState: '{}' };
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn<any>(component, 'startScenarioFromProps').and.callThrough();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      spyOn<any>(component, 'getOrderStatus').and.callThrough();
      spyOn<any>(component, 'getOrderIdFromApi').and.callThrough();
      component['startPlayer']();
      expect(component['startScenarioFromProps']).toBeCalled();
      expect(component['handleOrder']).not.toBeCalled();
      expect(component['getOrderStatus']).not.toBeCalled();
      expect(component['getOrderIdFromApi']).not.toBeCalled();
    });

    it('should call hasOrderStatus case', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, orderId: '2145', canStartNew: true, invited: false };
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn<any>(component, 'startScenarioFromProps').and.callThrough();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      spyOn<any>(component, 'getOrderStatus').and.callThrough();
      spyOn<any>(component, 'getOrderIdFromApi').and.callThrough();
      spyOn<any>(component, 'hasOrderStatus').and.callThrough();
      component['startPlayer']();
      expect(component['startScenarioFromProps']).not.toBeCalled();
      expect(component['hasOrderStatus']).toBeCalled();
      expect(component['handleOrder']).toBeCalled();
      expect(component['getOrderStatus']).not.toBeCalled();
      expect(component['getOrderIdFromApi']).not.toBeCalled();
    });

    it('should call handleOrder case', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, orderId: '2145', canStartNew: true, invited: false };
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn<any>(component, 'startScenarioFromProps').and.callThrough();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      spyOn<any>(component, 'getOrderStatus').and.callThrough();
      spyOn<any>(component, 'getOrderIdFromApi').and.callThrough();
      component['startPlayer']();
      expect(component['startScenarioFromProps']).not.toBeCalled();
      expect(component['handleOrder']).toBeCalled();
      expect(component['getOrderStatus']).not.toBeCalled();
      expect(component['getOrderIdFromApi']).not.toBeCalled();
    });

    it('should call getOrderStatus case', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, orderId: '2145' };
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn<any>(component, 'startScenarioFromProps').and.callThrough();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      spyOn<any>(component, 'getOrderStatus').and.callThrough();
      spyOn<any>(component, 'getOrderIdFromApi').and.callThrough();
      component['startPlayer']();
      expect(component['startScenarioFromProps']).not.toBeCalled();
      expect(component['getOrderStatus']).toBeCalled();
      expect(component['getOrderIdFromApi']).not.toBeCalled();
    });

    it('should call getOrderIdFromApi case', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock };
      fixture.detectChanges();
      loadService.loaded.next(true);
      spyOn<any>(component, 'startScenarioFromProps').and.callThrough();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      spyOn<any>(component, 'getOrderStatus').and.callThrough();
      spyOn<any>(component, 'getOrderIdFromApi').and.callThrough();
      component['startPlayer']();
      expect(component['startScenarioFromProps']).not.toBeCalled();
      expect(component['getOrderStatus']).not.toBeCalled();
      expect(component['getOrderIdFromApi']).toBeCalled();
    });
  });

  describe('hasOrderStatus()', () => {
    it('should return true if has orderId and some of invited or canStartNew', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      const orderId = '2145';
      const canStartNew = true;
      const invited = false;
      fixture.detectChanges();
      const hasOrderStatus = component['hasOrderStatus'](orderId, invited, canStartNew);
      expect(hasOrderStatus).toBe(true);
    });

    it('should return true if has orderId and some of invited or canStartNew', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      const orderId = '2145';
      fixture.detectChanges();
      const hasOrderStatus = component['hasOrderStatus'](orderId);
      expect(hasOrderStatus).toBe(false);
    });

    it('should return true if has orderId and some of invited or canStartNew with false state', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      const orderId = '2145';
      const canStartNew = false;
      const invited = false;
      fixture.detectChanges();
      const hasOrderStatus = component['hasOrderStatus'](orderId, invited, canStartNew);
      expect(hasOrderStatus).toBe(true);
    });
  });

  describe('startScenarioFromProps()', () => {
    it('should call log of loggerService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, initState: JSON.stringify(responseDto) };
      fixture.detectChanges();
      spyOn(loggerService, 'log').and.callThrough();
      component['startScenarioFromProps']();
      expect(loggerService.log).toBeCalled();
    });

    it('should set store to formPlayerService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, initState: JSON.stringify(responseDto) };
      fixture.detectChanges();
      const setterSpy = jest.spyOn(formPlayerService, 'store', 'set');
      component['startScenarioFromProps']();
      expect(setterSpy).toBeCalledWith(responseDto);
    });

    it('should call navigate of formPlayerService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, initState: JSON.stringify(responseDto) };
      fixture.detectChanges();
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['startScenarioFromProps']();
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

    beforeEach(() => {
      spyOn(formPlayerService, 'getOrderStatus').and.returnValue(of(checkIfOrderExistResult));
    });

    it('should call invited of serviceDataService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = { ...serviceDataMock, orderId: '123456' };
      fixture.detectChanges();
      spyOn<any>(component, 'handleOrderDataResponse');
      component['getOrderStatus']();
      expect(component['handleOrderDataResponse']).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('getOrderIdFromApi()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true
    };

    beforeEach(() => {
      spyOn(formPlayerService, 'checkIfOrderExist').and.returnValue(of(checkIfOrderExistResult));
    });

    it('should call invited of serviceDataService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn<any>(component, 'handleOrderDataResponse');
      component['getOrderIdFromApi']();
      expect(component['handleOrderDataResponse']).toBeCalledWith(checkIfOrderExistResult);
    });
  });

  describe('handleOrderDataResponse()', () => {
    const checkIfOrderExistResult = {
      orderId: '123456',
      isInviteScenario: false,
      canStartNew: true
    };

    it('should call invited of serviceDataService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      const spySetter = jest.spyOn(serviceDataService, 'invited', 'set');
      component['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.isInviteScenario);
    });

    it('should call orderId of serviceDataService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      const spySetter = jest.spyOn(serviceDataService, 'orderId', 'set');
      component['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.orderId);
    });

    it('should call canStartNew of serviceDataService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      const spySetter = jest.spyOn(serviceDataService, 'canStartNew', 'set');
      component['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(spySetter).toBeCalledWith(checkIfOrderExistResult.canStartNew);
    });

    it('should call handleOrder', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn<any>(component, 'handleOrder').and.callThrough();
      component['handleOrderDataResponse'](checkIfOrderExistResult);
      expect(component['handleOrder']).toBeCalledWith(
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

    it('should call shouldShowContinueOrderModal', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn<any>(component, 'shouldShowContinueOrderModal').and.callThrough();
      component['handleOrder'](orderId, invited, canStartNew);
      expect(component['shouldShowContinueOrderModal']).toBeCalledWith(orderId, invited, canStartNew);
    });

    it('should call showContinueOrderModal when shouldShowContinueOrderModal return true', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn<any>(component, 'shouldShowContinueOrderModal').and.returnValue(true);
      spyOn<any>(component, 'showContinueOrderModal').and.callThrough();
      component['handleOrder'](orderId, invited, canStartNew);
      expect(component['showContinueOrderModal']).toBeCalled();
    });

    it('should call initData of formPlayerService when shouldShowContinueOrderModal return false', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn<any>(component, 'shouldShowContinueOrderModal').and.returnValue(false);
      spyOn(formPlayerService, 'initData').and.callThrough();
      component['handleOrder'](orderId, invited, canStartNew);
      expect(formPlayerService.initData).toBeCalledWith(orderId, invited);
    });
  });

  describe('shouldShowContinueOrderModal()', () => {
    const orderId = '1234';
    const invited = false;
    const canStartNew = true;

    it('should return true if not invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'isNeedToShowLastScreen').and.returnValue(false);
      const shouldShowContinueOrderModal = component['shouldShowContinueOrderModal'](orderId, invited, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(true);
    });

    it('should return false if not invited, canStartNew, not empty orderId, isNeedToShowLastScreen', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'isNeedToShowLastScreen').and.returnValue(true);
      const shouldShowContinueOrderModal = component['shouldShowContinueOrderModal'](orderId, invited, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if not invited, canStartNew, empty orderId, not isNeedToShowLastScreen', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'isNeedToShowLastScreen').and.returnValue(true);
      const shouldShowContinueOrderModal = component['shouldShowContinueOrderModal'](null, invited, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if invited, canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'isNeedToShowLastScreen').and.returnValue(true);
      const shouldShowContinueOrderModal = component['shouldShowContinueOrderModal'](orderId, true, canStartNew);
      expect(shouldShowContinueOrderModal).toBe(false);
    });

    it('should return false if not invited, not canStartNew, not empty orderId, not isNeedToShowLastScreen', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'isNeedToShowLastScreen').and.returnValue(true);
      const shouldShowContinueOrderModal = component['shouldShowContinueOrderModal'](orderId, invited, false);
      expect(shouldShowContinueOrderModal).toBe(false);
    });
  });

  describe('showContinueOrderModal()', () => {
    it('should call openModal of continueOrderModalService', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(continueOrderModalService, 'openModal').and.callThrough();
      component['showContinueOrderModal']();
      expect(continueOrderModalService.openModal).toBeCalled();
    });

    it('should call initData of formPlayerService with orderId', () => {
      const orderId = '1234';
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(continueOrderModalService, 'openModal').and.returnValue(of(true));
      serviceDataService.orderId = orderId;
      spyOn(formPlayerService, 'initData').and.callThrough();
      component['showContinueOrderModal']();
      expect(formPlayerService.initData).toBeCalledWith(orderId, false);
    });

    it('should call initData of formPlayerService without orderId', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(continueOrderModalService, 'openModal').and.returnValue(of(false));
      spyOn(formPlayerService, 'initData').and.callThrough();
      component['showContinueOrderModal']();
      expect(formPlayerService.initData).toBeCalledWith(null, false);
    });
  });

  describe('nextStep()', () => {
    it('should call navigate of formPlayerService with next param', () => {
      const navigation = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['nextStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.NEXT);
    });
  });

  describe('prevStep()', () => {
    it('should call navigate of formPlayerService with prev param', () => {
      const navigation = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['prevStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.PREV);
    });
  });

  describe('skipStep()', () => {
    it('should call navigate of formPlayerService with skip param', () => {
      const navigation = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['skipStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.SKIP);
    });
  });

  describe('render throbber', () => {
    it('should render throbber', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      screenService.isFirstLoading$ = of(true);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber).not.toBeNull();
    });

    it('should not render throbber', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      screenService.isFirstLoading$ = of(false);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber).toBeNull();
    });

    it('throbber should has big size', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      screenService.isFirstLoading$ = of(true);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber.attributes.size).toBe('big');
    });
  });

  describe('render screen resolver', () => {
    it('should not render screen resolver when player not loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      formPlayerService.playerLoaded$ = of(false);
      configService.isLoaded$ = of(true);
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeNull();
    });

    it('should not render screen resolver when config not loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      formPlayerService.playerLoaded$ = of(true);
      configService.isLoaded$ = of(false);
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeNull();
    });

    it('should render screen resolver when config loaded and player loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      formPlayerService.playerLoaded$ = of(true);
      configService.isLoaded$ = of(true);
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).not.toBeNull();
    });
  });

  describe('render modal', () => {
    it('should render screen modal', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      fixture.detectChanges();
      const screenModal = fixture.debugElement.query(By.css('epgu-constructor-screen-modal'));
      expect(screenModal).not.toBeNull();
    });

    it('should render modal container', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      fixture.detectChanges();
      const modalContainer = fixture.debugElement.query(By.css('epgu-constructor-modal-container'));
      expect(modalContainer).not.toBeNull();
    });
  });
});
