import { Component, Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { AppRouterState, AppTypes, DataDirectionType, InputAppDto } from '@epgu/epgu-constructor-types';

import { AppBaseComponent, getAppStorageKey } from './app-base.component';
import { AppStateService } from '../app-state/app-state.service';
import { AppStateQuery } from '../app-state/app-state.query';
import { CfAppStateService } from '../../core/services/cf-app-state/cf-app-state.service';
import { LocationService } from '../../core/services/location/location.service';
import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import { AppStateServiceStub } from '../app-state/app-state.service.stub';
import { AppStateQueryStub } from '../app-state/app-state.query.stub';
import { CfAppStateServiceStub } from '../../core/services/cf-app-state/cf-app-state.service.stub';
import { LocationServiceStub } from '../../core/services/location/location.service.stub';
import { LocalStorageServiceStub } from '../../core/services/local-storage/local-storage.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { AppNavigationRuleService } from '../app-navigation-rule/app-navigation-rule.service';
import { AppNavigationRuleServiceStub } from '../app-navigation-rule/app-navigation-rule.service.stub';

export interface TestValueType {
  someKey: string
}

export interface TestStateType extends AppRouterState {
  someFilters: {
    [key: string]: string
  }
}

@Component({
  template: ''
})
class TestAppComponent extends AppBaseComponent<TestValueType, TestStateType> {
  public appType = 'TestAppComponent';
  constructor (public injector: Injector) {super(injector);}
}

describe('AppBaseModule', () => {
  let component: TestAppComponent;
  let fixture: ComponentFixture<TestAppComponent>;
  let cfAppStateService: CfAppStateService;
  let localStorageService: LocalStorageService;
  let appStateService: AppStateService<TestValueType, TestStateType>;
  let appStateQuery: AppStateQuery<TestValueType, TestStateType>;
  let locationService: LocationService;
  let appNavigationRuleService: AppNavigationRuleService;
  let eventBusService: EventBusService;
  let mockInputData: InputAppDto;
  let getLocalStorageSpy;
  let setStateSpy;
  let key: string;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAppComponent ],
      providers: [
        EventBusService,
        { provide: AppNavigationRuleService, useClass: AppNavigationRuleServiceStub },
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: CfAppStateService, useClass: CfAppStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockInputData = {
      componentId: 'ti1',
      componentType: 'TestAppComponent' as AppTypes,
      value: '{"value": {}, "state": {}}',
      callbackRedirectUrl: '/some/redirect/url',
      isPrevStepCase: false
    };

    fixture = TestBed.createComponent(TestAppComponent);
    cfAppStateService = TestBed.inject(CfAppStateService);
    localStorageService = TestBed.inject(LocalStorageService);
    appStateService = TestBed.inject(AppStateService);
    appStateQuery = TestBed.inject(AppStateQuery);
    locationService = TestBed.inject(LocationService);
    appNavigationRuleService = TestBed.inject(AppNavigationRuleService);
    eventBusService = TestBed.inject(EventBusService);
    jest.spyOn(cfAppStateService, 'getState').mockReturnValue(mockInputData);
    jest.spyOn(appStateQuery, 'storeState', 'get').mockReturnValue(JSON.parse(mockInputData.value));
    getLocalStorageSpy = jest.spyOn(localStorageService, 'get').mockReturnValue(null);
    setStateSpy = jest.spyOn(cfAppStateService, 'setState');
    component = fixture.componentInstance;
    fixture.detectChanges();
    key = getAppStorageKey(mockInputData.componentType, mockInputData.componentId);
  });

  describe('openApp()', () => {
    it('should set inputAppData', () => {
      component.openApp();
      expect(component.inputAppData).toBe(mockInputData);
    });

    it('should throw error if input types not equal lib type', () => {
      component.appType = 'SomeOtherApp';
      fixture.detectChanges();
      const t = () => {
        component.openApp();
      };
      expect(t).toThrowError();
    });

    it('shouldn\'t throw error if input types are equals', () => {
      const t = () => {
        component.openApp();
      };
      expect(t).not.toThrowError();
    });

    it('should call localStorageService get with key', () => {
      component.openApp();
      expect(getLocalStorageSpy).toBeCalledWith(key);
    });

    it('should call appStateService with stateFromStorage', () => {
      const stateFromStorageMock = {
        value: 'someValue',
        state: 'someState'
      };
      jest.spyOn(localStorageService, 'get').mockReturnValue(stateFromStorageMock);
      const initializeSpy = jest.spyOn(appStateService, 'initialize');
      component.openApp();
      expect(initializeSpy).toBeCalledWith(stateFromStorageMock);
    });

    it('should call appStateService with state from input data and firstComponent if there is no stateFromStorage and not prevStepCase', () => {
      const componentName = 'firstComponent';
      const initializeSpy = jest.spyOn(appStateService, 'initialize');
      jest.spyOn(appNavigationRuleService, 'getFirst').mockReturnValue(componentName);
      component.openApp();
      const value = JSON.parse(mockInputData.value);
      value.state.currentComponent = componentName;
      expect(initializeSpy).toBeCalledWith(value);
    });

    it('should call appStateService with state from input data and lastComponent if there is no stateFromStorage and prevStepCase', () => {
      jest.spyOn(cfAppStateService, 'getState').mockReturnValue({ ...mockInputData, isPrevStepCase: true });
      const componentName = 'lastComponent';
      const initializeSpy = jest.spyOn(appStateService, 'initialize');
      jest.spyOn(appNavigationRuleService, 'getLast').mockReturnValue(componentName);
      component.openApp();
      const value = JSON.parse(mockInputData.value);
      value.state.currentComponent = componentName;
      expect(initializeSpy).toBeCalledWith(value);
    });

    it('should call appStateService with state from input data and set empty value and empty state', () => {
      jest.spyOn(cfAppStateService, 'getState').mockReturnValue({ ...mockInputData, value: '{}' });
      const componentName = 'firstComponent';
      const initializeSpy = jest.spyOn(appStateService, 'initialize');
      jest.spyOn(appNavigationRuleService, 'getFirst').mockReturnValue(componentName);
      component.openApp();
      const value = JSON.parse(mockInputData.value);
      value.state.currentComponent = componentName;
      expect(initializeSpy).toBeCalledWith(value);
    });

    it('should subscribe on update lib state', () => {
      expect(component['storeSub']).toBeUndefined();
      component.openApp();
      expect(component['storeSub']).toBeTruthy();
    });

    it('should call localStorageService if appState update', () => {
      const storeState = JSON.parse(mockInputData.value);
      const setLocalStorageSpy = jest.spyOn(localStorageService, 'set');
      appStateQuery.store$ = of(storeState);
      component.openApp();
      expect(setLocalStorageSpy).toBeCalledWith(key, storeState);
    });
  });
  describe('closeApp()', () => {
    let expectedOutputData;
    beforeEach(() => {
      expectedOutputData = {
        componentId: mockInputData.componentId,
        componentType: mockInputData.componentType,
        value: JSON.stringify(appStateQuery.storeState),
        isPrevStepCase: false,
      };
      component.openApp();
    });

    it('should call close with false app if emit closeApp event is not prevStepCase', () => {
      const closeSpy = jest.spyOn(component, 'closeApp');
      eventBusService.emit('closeApp', false);
      expect(closeSpy).toBeCalledWith(false);
    });

    it('should call close with true app if emit closeApp event is prevStepCase', () => {
      const closeSpy = jest.spyOn(component, 'closeApp');
      eventBusService.emit('closeApp', true);
      expect(closeSpy).toBeCalledWith(true);
    });

    it('should call setState of cfAppStateService and pass outputData when there is not isPrevStepCase', () => {
      component.closeApp();
      expect(setStateSpy).toBeCalledWith(expectedOutputData, DataDirectionType.OUTPUT);
    });

    it('should call setState of cfAppStateService and pass outputData when there is isPrevStepCase', () => {
      expectedOutputData.isPrevStepCase = true;
      component.closeApp(true);
      expect(setStateSpy).toBeCalledWith(expectedOutputData, DataDirectionType.OUTPUT);
    });

    it('should call setState of cfAppStateService and pass outputData without currentComponent', () => {
      jest.spyOn(appStateQuery, 'storeState', 'get').mockReturnValue(
        { value: {} as TestValueType, state: ({ currentComponent: 'lastComponent' } as unknown as TestStateType) });
      component.closeApp();
      expect(setStateSpy).toBeCalledWith(expectedOutputData, DataDirectionType.OUTPUT);
    });

    it('should call unsubscribe on synchronization subscription', () => {
      const unsubscribeSpy = jest.spyOn<any, any>(component['storeSub'], 'unsubscribe');
      component.closeApp();
      expect(unsubscribeSpy).toBeCalled();
    });

    it('should call unsubscribe on synchronization subscription', () => {
      const unsubscribeSpy = jest.spyOn<any, any>(component['eventSub'], 'unsubscribe');
      component.closeApp();
      expect(unsubscribeSpy).toBeCalled();
    });

    it('should call delete local lib state storage with key', () => {
      const deleteSpy = jest.spyOn(localStorageService, 'delete');
      component.closeApp();
      expect(deleteSpy).toBeCalledWith(key);
    });

    it('should redirect back to cf', () => {
      const hrefSpy = jest.spyOn(locationService, 'href');
      component.closeApp();
      expect(hrefSpy).toBeCalledWith(mockInputData.callbackRedirectUrl);
    });
  });
});
