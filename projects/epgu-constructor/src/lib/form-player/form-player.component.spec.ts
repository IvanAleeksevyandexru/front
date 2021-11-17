import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import {
  LoadServiceStub,
  MainContainerModule,
  TracingServiceStub,
  ObjectHelperService,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import {
  ModalContainerComponent,
  ModalServiceStub,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenResolverComponent } from '../screen/screen-resolver/screen-resolver.component';
import { ScreenModalComponent } from '../modal/screen-modal/screen-modal.component';
import { InitDataService } from '../core/services/init-data/init-data.service';
import { NavigationServiceStub } from '../core/services/navigation/navigation.service.stub';
import {
  ConfigService,
  ConfigApiService,
  ConfigApiServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
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
import { LoadService } from '@epgu/ui/services/load';
import { AutocompleteService } from '../core/services/autocomplete/autocomplete.service';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteApiService } from '../core/services/autocomplete/autocomplete-api.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../screen/current-answers.service';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub, TracingService } from '@epgu/epgu-constructor-ui-kit';
import { SessionService } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponentsContainerComponent } from '../component/logic-screen/component/logic-components-container.component';
import { AutocompleteAutofillService } from '../core/services/autocomplete/autocomplete-autofill.service';
import { AutocompletePrepareService } from '../core/services/autocomplete/autocomplete-prepare.service';
import { TerraByteApiService } from '../core/services/terra-byte-api/terra-byte-api.service';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { AnimationBuilder } from '@angular/animations';
import { JsonHelperService } from '../core/services/json-helper/json-helper.service';
import { NotifierDisclaimerModule } from '../shared/components/disclaimer/notifier/notifier.module';
import { FormPlayerApiServiceStub } from './services/form-player-api/form-player-api.service.stub';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { HttpClientModule } from '@angular/common/http';

describe('FormPlayerComponent', () => {
  let fixture: ComponentFixture<FormPlayerComponent>;
  let component: FormPlayerComponent;
  let formPlayerService: FormPlayerService;
  let formPlayerConfigApiService: ConfigApiService;
  let loadService: LoadService;
  let configService: ConfigService;
  let navService: NavigationService;
  let screenService: ScreenService;
  let autocompleteService: AutocompleteService;
  let tracingService: TracingService;
  let initDataService: InitDataService;
  let ScreenResolverComponentMock = MockComponent(ScreenResolverComponent);
  let ScreenModalComponentMock = MockComponent(ScreenModalComponent);
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);
  let logicComponentMock = MockComponent(LogicComponentsContainerComponent);
  let serviceDataMock: ServiceEntity = {
    serviceId: '10000100',
    targetId: '-10000100',
  };
  let contextMock = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MainContainerModule,
        NotifierDisclaimerModule,
        BaseUiModule,
        NotifierModule,
        HttpClientModule,
      ],
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
        DownloadService,
        ObjectHelperService,
        DatesToolsService,
        CurrentAnswersService,
        WINDOW_PROVIDERS,
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: TracingService, useClass: TracingServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigApiService, useClass: ConfigApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ContinueOrderModalService, useClass: ContinueOrderModalServiceStub },
        { provide: FormPlayerStartManager, useClass: FormPlayerStartManagerStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        SessionService,
        TerraByteApiService,
        AnimationBuilder,
        JsonHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    formPlayerService = TestBed.inject(FormPlayerService);
    initDataService = TestBed.inject(InitDataService);
    formPlayerConfigApiService = TestBed.inject(ConfigApiService);
    loadService = TestBed.inject(LoadService);
    autocompleteService = TestBed.inject(AutocompleteService);
    tracingService = TestBed.inject(TracingService);
    configService = TestBed.inject(ConfigService);
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);

    fixture = TestBed.createComponent(FormPlayerComponent);
    component = fixture.componentInstance;
    component.service = serviceDataMock;
    component.context = contextMock;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should call init method of initDataService with service param', () => {
      const spy = jest.spyOn(initDataService, 'init');
      component.ngOnInit();
      expect(spy).toBeCalledWith(serviceDataMock, contextMock);
    });

    it('should call initFormPlayerConfig', () => {
      const spy = jest.spyOn<any, string>(component, 'initFormPlayerConfig');
      component.ngOnInit();
      expect(spy).toBeCalled();
    });

    it('should call initNavigation', () => {
      const spy = jest.spyOn<any, string>(component, 'initNavigation');
      component.ngOnInit();
      expect(spy).toBeCalled();
    });

    it('should call initSettingOfScreenIdToAttr', () => {
      const spy = jest.spyOn<any, string>(component, 'initSettingOfScreenIdToAttr');
      component.ngOnInit();
      expect(spy).toBeCalled();
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should call startPlayer', () => {
      const spy = jest.spyOn<any, string>(component, 'startPlayer');
      component.ngAfterViewInit();
      expect(spy).toBeCalled();
    });
  });

  describe('ngOnChanges()', () => {
    it('should call init method of initDataService with service param', () => {
      const spy = jest.spyOn(initDataService, 'init');
      component.ngOnChanges({ service: new SimpleChange(null, serviceDataMock, true) });
      expect(spy).toBeCalledWith(serviceDataMock, contextMock);
    });
  });

  describe('initConfigDependentEntities()', () => {
    it('should call autocompleteService init with true', () => {
      configService['_isAutocompleteServiceDisabled'] = true;
      const spy = jest.spyOn(autocompleteService, 'init');
      component['initConfigDependentEntities']();
      expect(spy).toBeCalledWith(true);
    });

    it('should call autocompleteService init with false', () => {
      const spy = jest.spyOn(autocompleteService, 'init');
      component['initConfigDependentEntities']();
      expect(spy).toBeCalledWith(false);
    });

    it('should call tracingService init with true', () => {
      configService['_zipkinGenerationEnabled'] = true;
      const spy = jest.spyOn(tracingService, 'init');
      component['initConfigDependentEntities']();
      expect(spy).toBeCalledWith(true);
    });

    it('should call tracingService init with false', () => {
      const spy = jest.spyOn(tracingService, 'init');
      component['initConfigDependentEntities']();
      expect(spy).toBeCalledWith(false);
    });

    it('should call tracingService setter serviceCode', () => {
      const serviceCode = '42';
      const setSpy = jest.spyOn(tracingService, 'serviceCode', 'set');
      screenService.serviceCode = serviceCode;
      component['initConfigDependentEntities']();
      fixture.detectChanges();
      expect(setSpy).toBeCalledWith(serviceCode);
    });
  });

  describe('initFormPlayerConfig()', () => {
    it('shouldn\'t call getFormPlayerConfig method of formPlayerConfigApiService when loadService not loaded', () => {
      loadService.loaded.next(false);
      const spy = jest.spyOn(formPlayerConfigApiService, 'getFormPlayerConfig');
      component['initFormPlayerConfig']();
      expect(spy).not.toBeCalled();
    });

    it('shouldn\'t call initCore method of configService when loadService not loaded', () => {
      loadService.loaded.next(false);
      const spy = jest.spyOn(configService, 'initCore');
      component['initFormPlayerConfig']();
      expect(spy).not.toBeCalled();
    });

    it('should call initCore method of configService when loadService has loaded', () => {
      loadService.loaded.next(true);
      const spy = jest.spyOn(configService, 'initCore');
      component['initFormPlayerConfig']();
      expect(spy).toBeCalled();
    });

    it('should call getFormPlayerConfig method of formPlayerConfigApiService when loadService has loaded', () => {
      loadService.loaded.next(true);
      const spy = jest.spyOn(formPlayerConfigApiService, 'getFormPlayerConfig');
      component['initFormPlayerConfig']();
      expect(spy).toBeCalled();
    });

    it('should set form player config', () => {
      const config = {};
      loadService.loaded.next(true);
      // @ts-ignore
      jest.spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').mockReturnValue(of(config));
      const setterSpy = jest.spyOn(configService, 'config', 'set');
      component['initFormPlayerConfig']();
      expect(setterSpy).toBeCalled();
    });

    it('should call next of isConfigReady$', () => {
      const config = {};
      loadService.loaded.next(true);
      // @ts-ignore
      jest.spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').mockReturnValue(of(config));
      const spy = jest.spyOn<any, string>(component['isConfigReady$'], 'next');
      component['initFormPlayerConfig']();
      expect(spy).toBeCalledWith(true);
    });
  });

  describe('initNavigation()', () => {
    it('should call nextStep with param when push nextStep prev-button', () => {
      const navigationParam = {};
      const spy = jest.spyOn<any, string>(component, 'nextStep');
      navService.next(navigationParam);
      component['initNavigation']();
      expect(spy).toBeCalledWith(navigationParam);
    });

    it('should call prevStep with param when push prevStep prev-button', () => {
      const navigationParam = {};
      const spy = jest.spyOn<any, string>(component, 'prevStep');
      navService.prev(navigationParam);
      component['initNavigation']();
      expect(spy).toBeCalledWith(navigationParam);
    });

    it('should call skipStep with param when push skipStep prev-button', () => {
      const navigationParam = {};
      const spy = jest.spyOn<any, string>(component, 'skipStep');
      navService.skip(navigationParam);
      component['initNavigation']();
      expect(spy).toBeCalledWith(navigationParam);
    });

    it('should call formPlayerService initData with param when push restartOrder', () => {
      const spy = jest.spyOn<any, string>(formPlayerService, 'initData');
      navService.restartOrder();
      component['initNavigation']();
      expect(spy).toBeCalledWith();
    });

    it('should call patchStepOnCli with param when push patchStepOnCli prev-button', () => {
      const navigationParam = {};
      const spy = jest.spyOn<any, string>(component, 'patchStepOnCli');
      navService.patchOnCli(navigationParam);
      component['initNavigation']();
      expect(spy).toBeCalledWith(navigationParam);
    });
  });

  describe('initSettingOfScreenIdToAttr()', () => {
    const display = {
      id: 's1',
      name: '',
      header: '',
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
      const spy = jest.spyOn(formPlayerService, 'navigate');
      component['nextStep'](navigation);
      expect(spy).toBeCalledWith(navigation, FormPlayerNavigation.NEXT);
    });
  });

  describe('prevStep()', () => {
    it('should call navigate of formPlayerService with prev param', () => {
      const navigation = {};
      const spy = jest.spyOn(formPlayerService, 'navigate');
      component['prevStep'](navigation);
      expect(spy).toBeCalledWith(navigation, FormPlayerNavigation.PREV);
    });
  });

  describe('skipStep()', () => {
    it('should call navigate of formPlayerService with skip param', () => {
      const navigation = {};
      const spy = jest.spyOn(formPlayerService, 'navigate');
      component['skipStep'](navigation);
      expect(spy).toBeCalledWith(navigation, FormPlayerNavigation.SKIP);
    });
  });

  describe('patchStepOnCli()', () => {
    it('should call patchStore of formPlayerService with skip param', () => {
      const newScenarioDtoDiff = {};
      const spy = jest.spyOn(formPlayerService, 'patchStore');
      component['patchStepOnCli'](newScenarioDtoDiff);
      expect(spy).toBeCalledWith(newScenarioDtoDiff);
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
      const logicComponent = fixture.debugElement.query(By.css('epgu-constructor-logic-container'));
      expect(logicComponent).toBeTruthy();
    });
  });
});
