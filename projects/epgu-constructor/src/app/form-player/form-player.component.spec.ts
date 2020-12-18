import { TestBed } from '@angular/core/testing';
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
import { FormPlayerStartService } from './services/form-player-start/form-player-start.service';
import { FormPlayerStartServiceStub } from './services/form-player-start/form-player-start.service.stub';
import { LocalStorageServiceStub } from '../core/services/local-storage/local-storage.service.stub';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';


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
  let formPlayerStartService: FormPlayerStartService;
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
        { provide: FormPlayerConfigApiService, useClass: FormPlayerConfigApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ContinueOrderModalService, useClass: ContinueOrderModalServiceStub },
        { provide: FormPlayerStartService, useClass: FormPlayerStartServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub }
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
    formPlayerStartService = TestBed.inject(FormPlayerStartService);
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

  describe('nextStep()', () => {
    it('should call navigate of formPlayerService with next param', () => {
      const navigation = {};
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
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
      component.service = serviceDataMock;
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
      component.service = serviceDataMock;
      fixture.detectChanges();
      spyOn(formPlayerService, 'navigate').and.callThrough();
      component['skipStep'](navigation);
      expect(formPlayerService.navigate).toBeCalledWith(navigation, FormPlayerNavigation.SKIP);
    });
  });

  describe('render throbber', () => {
    it('should render throbber', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      component.isFirstLoading$ = of(true);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber).toBeTruthy();
    });

    it('should not render throbber', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      component.isFirstLoading$ = of(false);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber).toBeFalsy();
    });

    it('throbber should has big size', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      component.isFirstLoading$ = of(true);
      fixture.detectChanges();
      const throbber = fixture.debugElement.query(By.css('lib-throbber-hexagon'));
      expect(throbber.attributes.size).toBe('big');
    });
  });

  describe('render screen resolver', () => {
    it('should not render screen resolver when player not loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      formPlayerService['_playerLoaded$'] = of(false);
      configService['_isLoaded$'] = of(true);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeFalsy();
    });

    it('should not render screen resolver when config not loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      formPlayerService['_playerLoaded$'] = of(true);
      configService['_isLoaded$'] = of(false);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeFalsy();
    });

    it('should render screen resolver when config loaded and player loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      formPlayerService['_playerLoaded$'] = of(true);
      configService['_isLoaded$'] = of(true);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      const screenResolver = fixture.debugElement.query(By.css('epgu-constructor-screen-resolver'));
      expect(screenResolver).toBeTruthy();
    });
  });

  describe('render modal', () => {
    it('should render screen modal', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      const screenModal = fixture.debugElement.query(By.css('epgu-constructor-screen-modal'));
      expect(screenModal).toBeTruthy();
    });

    it('should render modal container', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      const modalContainer = fixture.debugElement.query(By.css('epgu-constructor-modal-container'));
      expect(modalContainer).toBeTruthy();
    });
  });
});
