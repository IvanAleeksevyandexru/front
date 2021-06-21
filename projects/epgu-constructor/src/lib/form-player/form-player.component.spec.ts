import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { LoadService } from '@epgu/epgu-lib';
import { MockComponent } from 'ng-mocks';
import { LoadServiceStub, MainContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ModalContainerComponent, ModalServiceStub, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenResolverComponent } from '../screen/screen-resolver/screen-resolver.component';
import { ScreenModalComponent } from '../modal/screen-modal/screen-modal.component';
import { InitDataService } from '../core/services/init-data/init-data.service';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { FormPlayerConfigApiServiceStub } from './services/form-player-config-api/form-player-config-api.service.stub';
import { NavigationServiceStub } from '../core/services/navigation/navigation.service.stub';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../screen/screen.service';
import { ScreenServiceStub } from '../screen/screen.service.stub';
import { InitDataServiceStub } from '../core/services/init-data/init-data.service.stub';
import { FormPlayerNavigation, ServiceEntity } from './form-player.types';
import { of } from 'rxjs';
import { ContinueOrderModalService } from '../modal/continue-order-modal/continue-order-modal.service';
import { ContinueOrderModalServiceStub } from '../modal/continue-order-modal/continue-order-modal.service.stub';
import { By } from '@angular/platform-browser';
import { FormPlayerStartManager } from './services/form-player-start/form-player-start.manager';
import { FormPlayerStartManagerStub } from './services/form-player-start/form-player-start.manager.stub';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { SimpleChange } from '@angular/core';
import { EpguLibModuleInited } from '../shared/base.module';
import { AutocompleteService } from '../core/services/autocomplete/autocomplete.service';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteApiService } from '../core/services/autocomplete/autocomplete-api.service';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../screen/current-answers.service';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TracingService } from '../core/services/tracing/tracing.service';
import { SessionService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponent } from '../component/logic-screen/component/logic.component';
import { AutocompleteAutofillService } from '../core/services/autocomplete/autocomplete-autofill.service';
import { AutocompletePrepareService } from '../core/services/autocomplete/autocomplete-prepare.service';
import { TerraByteApiService } from '../core/services/terra-byte-api/terra-byte-api.service';
import { ScreenTypes } from '@epgu/epgu-constructor-types';

describe('FormPlayerComponent', () => {
  let fixture: ComponentFixture<FormPlayerComponent>;
  let component: FormPlayerComponent;
  let formPlayerService: FormPlayerService;
  let formPlayerConfigApiService: FormPlayerConfigApiService;
  let loadService: LoadService;
  let configService: ConfigService;
  let navService: NavigationService;
  let screenService: ScreenService;
  let loggerService: LoggerService;
  let continueOrderModalService: ContinueOrderModalService;
  let initDataService: InitDataService;
  let formPlayerStartService: FormPlayerStartManager;
  let ScreenResolverComponentMock = MockComponent(ScreenResolverComponent);
  let ScreenModalComponentMock = MockComponent(ScreenModalComponent);
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);
  let logicComponentMock = MockComponent(LogicComponent);
  let serviceDataMock: ServiceEntity = {
    serviceId: '10000100',
    targetId: '-10000100',
  };
  let contextMock = {};

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [EpguLibModuleInited, MainContainerModule],
      declarations: [
        FormPlayerComponent,
        ScreenResolverComponentMock,
        ModalContainerComponentMock,
        ScreenModalComponentMock,
        logicComponentMock,
      ],
      providers: [
        UnsubscribeService,
        LocationService,
        AutocompleteService,
        AutocompleteApiService,
        AutocompleteAutofillService,
        AutocompletePrepareService,
        EventBusService,
        ModalService,
        UtilsService,
        DatesToolsService,
        CurrentAnswersService,
        WINDOW_PROVIDERS,
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: FormPlayerConfigApiService, useClass: FormPlayerConfigApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ContinueOrderModalService, useClass: ContinueOrderModalServiceStub },
        { provide: FormPlayerStartManager, useClass: FormPlayerStartManagerStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        TracingService,
        SessionService,
        TerraByteApiService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    formPlayerService = TestBed.inject(FormPlayerService);
    initDataService = TestBed.inject(InitDataService);
    formPlayerConfigApiService = TestBed.inject(FormPlayerConfigApiService);
    loadService = TestBed.inject(LoadService);
    configService = TestBed.inject(ConfigService);
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    loggerService = TestBed.inject(LoggerService);
    continueOrderModalService = TestBed.inject(ContinueOrderModalService);
    formPlayerStartService = TestBed.inject(FormPlayerStartManager);

    fixture = TestBed.createComponent(FormPlayerComponent);
    component = fixture.componentInstance;
    component.service = serviceDataMock;
    component.context = contextMock;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should call init method of initDataService with service param', () => {
      spyOn(initDataService, 'init').and.callThrough();
      component.ngOnInit();
      expect(initDataService.init).toBeCalledWith(serviceDataMock, contextMock);
    });

    it('should call initFormPlayerConfig', () => {
      spyOn<any>(component, 'initFormPlayerConfig').and.callThrough();
      component.ngOnInit();
      expect(component['initFormPlayerConfig']).toBeCalled();
    });

    it('should call initNavigation', () => {
      spyOn<any>(component, 'initNavigation').and.callThrough();
      component.ngOnInit();
      expect(component['initNavigation']).toBeCalled();
    });

    it('should call initSettingOfScreenIdToAttr', () => {
      spyOn<any>(component, 'initSettingOfScreenIdToAttr').and.callThrough();
      component.ngOnInit();
      expect(component['initSettingOfScreenIdToAttr']).toBeCalled();
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should call startPlayer', () => {
      spyOn<any>(component, 'startPlayer').and.callThrough();
      component.ngAfterViewInit();
      expect(component['startPlayer']).toBeCalled();
    });
  });

  describe('ngOnChanges()', () => {
    it('should call init method of initDataService with service param', () => {
      spyOn(initDataService, 'init').and.callThrough();
      component.ngOnChanges({ service: new SimpleChange(null, serviceDataMock, true) });
      expect(initDataService.init).toBeCalledWith(serviceDataMock, contextMock);
    });
  });

  describe('initFormPlayerConfig()', () => {
    it('shouldn\'t call getFormPlayerConfig method of formPlayerConfigApiService when loadService not loaded', () => {
      loadService.loaded.next(false);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.callThrough();
      component['initFormPlayerConfig']();
      expect(formPlayerConfigApiService.getFormPlayerConfig).not.toBeCalled();
    });

    it('shouldn\'t call initCore method of configService when loadService not loaded', () => {
      loadService.loaded.next(false);
      spyOn(configService, 'initCore').and.callThrough();
      component['initFormPlayerConfig']();
      expect(configService.initCore).not.toBeCalled();
    });

    it('should call initCore method of configService when loadService has loaded', () => {
      loadService.loaded.next(true);
      spyOn(configService, 'initCore').and.callThrough();
      component['initFormPlayerConfig']();
      expect(configService.initCore).toBeCalled();
    });

    it('should call getFormPlayerConfig method of formPlayerConfigApiService when loadService has loaded', () => {
      loadService.loaded.next(true);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.callThrough();
      component['initFormPlayerConfig']();
      expect(formPlayerConfigApiService.getFormPlayerConfig).toBeCalled();
    });

    it('should set form player config', () => {
      const config = {};
      loadService.loaded.next(true);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.returnValue(of(config));
      const setterSpy = jest.spyOn(configService, 'config', 'set');
      component['initFormPlayerConfig']();
      expect(setterSpy).toBeCalled();
    });

    it('should call next of isConfigReady$', () => {
      const config = {};
      loadService.loaded.next(true);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.returnValue(of(config));
      spyOn<any>(component['isConfigReady$'], 'next').and.callThrough();
      component['initFormPlayerConfig']();
      expect(component['isConfigReady$'].next).toBeCalledWith(true);
    });
  });

  describe('initNavigation()', () => {
    it('should call nextStep with param when push nextStep prev-button', () => {
      const navigationParam = {};
      spyOn<any>(component, 'nextStep').and.callThrough();
      navService.next(navigationParam);
      component['initNavigation']();
      expect(component['nextStep']).toBeCalledWith(navigationParam);
    });

    it('should call prevStep with param when push prevStep prev-button', () => {
      const navigationParam = {};
      spyOn<any>(component, 'prevStep').and.callThrough();
      navService.prev(navigationParam);
      component['initNavigation']();
      expect(component['prevStep']).toBeCalledWith(navigationParam);
    });

    it('should call skipStep with param when push skipStep prev-button', () => {
      const navigationParam = {};
      spyOn<any>(component, 'skipStep').and.callThrough();
      navService.skip(navigationParam);
      component['initNavigation']();
      expect(component['skipStep']).toBeCalledWith(navigationParam);
    });

    it('should call patchStepOnCli with param when push patchStepOnCli prev-button', () => {
      const navigationParam = {};
      spyOn<any>(component, 'patchStepOnCli').and.callThrough();
      navService.patchOnCli(navigationParam);
      component['initNavigation']();
      expect(component['patchStepOnCli']).toBeCalledWith(navigationParam);
    });
  });

  describe('initSettingOfScreenIdToAttr()', () => {
    const display = {
      id: 's1',
      name: '',
      header: '',
      submitLabel: '',
      type: ScreenTypes.UNIQUE,
      terminal: false,
      components: [],
    };

    it('should set screenId to component param', () => {
      screenService.display = display;
      component['initSettingOfScreenIdToAttr']();
      expect(component.screenId).toBe(display.id);
    });

    it('should attr.test-screen-id be screenId', () => {
      screenService.display = display;
      component['initSettingOfScreenIdToAttr']();
      fixture.detectChanges();
      expect(fixture.debugElement.attributes['test-screen-id']).toBe(display.id);
    });
  });

  describe('nextStep()', () => {
    it('should call navigate of formPlayerService with next param', () => {
      const navigation = {};
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['nextStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.NEXT);
    });
  });

  describe('prevStep()', () => {
    it('should call navigate of formPlayerService with prev param', () => {
      const navigation = {};
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['prevStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.PREV);
    });
  });

  describe('skipStep()', () => {
    it('should call navigate of formPlayerService with skip param', () => {
      const navigation = {};
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['skipStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.SKIP);
    });
  });

  describe('patchStepOnCli()', () => {
    it('should call patchStore of formPlayerService with skip param', () => {
      const newScenarioDtoDiff = {};
      spyOn(formPlayerService, 'patchStore').and.callThrough();
      component['patchStepOnCli'](newScenarioDtoDiff);
      expect(formPlayerService.patchStore).toBeCalledWith(newScenarioDtoDiff);
    });
  });

  describe('render throbber', () => {
    it('should render throbber', () => {
      component.isFirstLoading$ = of(true);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber).toBeTruthy();
    });

    it('should not render throbber', () => {
      component.isFirstLoading$ = of(false);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber).toBeFalsy();
    });

    it('throbber should has big size', () => {
      component.isFirstLoading$ = of(true);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber.attributes.size).toBe('big');
    });
  });

  describe('render screen resolver', () => {
    it('should not render screen resolver when player not loaded', () => {
      formPlayerService['_playerLoaded$'] = of(false);
      configService['_isLoaded$'] = of(true);
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeFalsy();
    });

    it('should not render screen resolver when config not loaded', () => {
      formPlayerService['_playerLoaded$'] = of(true);
      configService['_isLoaded$'] = of(false);
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeFalsy();
    });

    it('should render screen resolver when config loaded and player loaded', () => {
      formPlayerService['_playerLoaded$'] = of(true);
      configService['_isLoaded$'] = of(true);
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeTruthy();
    });
  });

  describe('render modal', () => {
    it('should render screen modal', () => {
      component.isFirstLoading$ = of(false);
      formPlayerService['_playerLoaded$'] = of(true);
      configService['_isLoaded$'] = of(true);
      fixture.detectChanges();
      const screenModal = fixture.debugElement.query(By.css('epgu-constructor-screen-modal'));
      expect(screenModal).toBeTruthy();
    });

    it('should render modal container', () => {
      const modalContainer = fixture.debugElement.query(By.css('epgu-cf-ui-modal-container'));
      expect(modalContainer).toBeTruthy();
    });
  });

  describe('render logic', () => {
    it('should render logic component', () => {
      component.isFirstLoading$ = of(false);
      formPlayerService['_playerLoaded$'] = of(true);
      configService['_isLoaded$'] = of(true);
      fixture.detectChanges();
      const logicComponent = fixture.debugElement.query(By.css('epgu-constructor-logic'));
      expect(logicComponent).toBeTruthy();
    });
  });
});
