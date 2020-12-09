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
import { ModalService } from '../modal/modal.service';
import { ModalServiceStub } from '../modal/modal.service.stub';
import { ScreenService } from '../screen/screen.service';
import { ScreenServiceStub } from '../screen/screen.service.stub';
import { EpguLibModuleInited } from '../core/core.module';
import { ServiceDataServiceStub } from './services/service-data/service-data.service.stub';
import { Service } from './form-player.types';
import { BehaviorSubject, of } from 'rxjs';
import { Config } from '../core/config/config.types';


describe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let formPlayerConfigApiService: FormPlayerConfigApiService;
  let loadService: LoadService;
  let configService: ConfigService;
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
        { provide: ModalService, useClass: ModalServiceStub },
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
      loadService.loaded = new BehaviorSubject(false);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.callThrough();
      component['initFormPlayerConfig']();
      expect(formPlayerConfigApiService.getFormPlayerConfig).not.toBeCalled();
    });

    it('should call getFormPlayerConfig method of formPlayerConfigApiService when loadService has loaded', () => {
      const fixture = TestBed.createComponent(FormPlayerComponent);
      const component = fixture.componentInstance;
      component.service = serviceDataMock;
      fixture.detectChanges();
      loadService.loaded = new BehaviorSubject(true);
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
      loadService.loaded = new BehaviorSubject(true);
      spyOn(formPlayerConfigApiService, 'getFormPlayerConfig').and.returnValue(of(config));
      const setterSpy = jest.spyOn(configService, 'config', 'set');
      component['initFormPlayerConfig']();
      expect(setterSpy).toBeCalled();
    });
  });

});
