import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { AppScreenComponent } from './app-screen.component';
import { ComponentUniqueResolverComponent } from '../../component/unique-screen/component-unique-resolver/component-unique-resolver.component';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto, DisplayDto, OutputAppDto, ScreenTypes } from '@epgu/epgu-constructor-types';
import { CfAppStateService, CfAppStateServiceStub, LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';
import { InfoComponentModalComponent } from '../../modal/screen-modal/components/info-component-modal/info-component-modal.component';
import { ChangeDetectionStrategy } from '@angular/core';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
  valueFromCache: false
};

const displayDtoSample: DisplayDto = {
  components: [],
  header: 'header1',
  id: 'id1',
  name: 'name1',
  submitLabel: 'submitLabel1',
  type: ScreenTypes.APP,
  terminal: true,
};

describe('SpaScreenComponent', () => {
  let component: AppScreenComponent;
  let fixture: ComponentFixture<AppScreenComponent>;

  let navigationService: NavigationService;
  let configService: ConfigService;
  let screenService: ScreenService;
  let eventBusService: EventBusService;
  let cfAppStateService: CfAppStateService;

  const initComponent = () => {
    fixture = TestBed.createComponent(AppScreenComponent);
    component = fixture.componentInstance;
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppScreenComponent,
        ComponentUniqueResolverComponent,
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CfAppStateService, useClass: CfAppStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        EventBusService,
        CurrentAnswersService,
      ],
    }).overrideComponent(AppScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  });

  beforeEach(() => {
    navigationService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    cfAppStateService = TestBed.inject(CfAppStateService);
    configService = TestBed.inject(ConfigService);
    screenService.display = displayDtoSample;
    screenService.component = componentDtoSample;
    initComponent();
  });

  describe('Output case', () => {
    const state: OutputAppDto = {
      isPrevStepCase: false,
      value: '{ value: { a:42, b: 777 }, state: {}}}',
      componentType: 'ChildrenClubs',
      componentId: 'app1'
    };

    it('should call handleOutputSpaData and shouldn\'t call sendDataToSpa and redirectToSpa when on init', () => {
      jest.spyOn(cfAppStateService, 'getState').mockReturnValue(state);
      const handleOutputAppDataSpy = jest.spyOn<any, any>(component, 'handleOutputAppData');
      const sendDataToAppSpy = jest.spyOn<any, any>(component, 'sendDataToApp');
      const redirectToAppSpy = jest.spyOn<any, any>(component, 'redirectToApp');
      component.ngOnInit();
      expect(handleOutputAppDataSpy).toBeCalled();
      expect(sendDataToAppSpy).not.toBeCalled();
      expect(redirectToAppSpy).not.toBeCalled();
    });

    it('should call navigationService next with params on init', () => {
      jest.spyOn(cfAppStateService, 'getState').mockReturnValue(state);
      screenService.component = {
        id: 'app1',
        value: '',
        type: 'ChildrenClubs',
        visited: false,
        attrs: {}
      };
      const nextSpy = jest.spyOn(navigationService, 'next');
      component.ngOnInit();

      const expectedParam = {
        payload: {
          [screenService.component.id]: {
            value: state.value,
            visited: true,
          },
        },
      };

      expect(nextSpy).toBeCalledWith(expectedParam);
    });
  });

  describe('Input case', () => {
    beforeEach(() => {
      jest.spyOn(configService, 'appPathMap', 'get').mockReturnValue({ ChildrenClubs: '/some/redirect/url' });
      screenService.componentType = 'ChildrenClubs';
    });

    it('shouldn\'t call handleOutputSpaData and should call sendDataToSpa and redirectToSpa when on init', () => {
      jest.spyOn(cfAppStateService, 'getState').mockReturnValue(null);
      const handleOutputAppDataSpy = jest.spyOn<any, any>(component, 'handleOutputAppData');
      const sendDataToAppSpy = jest.spyOn<any, any>(component, 'sendDataToApp');
      const redirectToAppSpy = jest.spyOn<any, any>(component, 'redirectToApp');
      fixture.detectChanges();
      component.ngOnInit();
      expect(handleOutputAppDataSpy).not.toBeCalled();
      expect(sendDataToAppSpy).toBeCalled();
      expect(redirectToAppSpy).toBeCalled();
    });
  });
});
