import { Component, Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppBaseComponent } from './app-base.component';
import { AppStateService } from '../../services/app-state/app-state.service';
import { AppStateQuery } from '../../services/app-state/app-state.query';
import { CfAppStateService } from '../../services/cf-app-state/cf-app-state.service';
import { LocationService } from '../../services/location/location.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { AppStateServiceStub } from '../../services/app-state/app-state.service.stub';
import { AppStateQueryStub } from '../../services/app-state/app-state.query.stub';
import { CfAppStateServiceStub } from '../../services/cf-app-state/cf-app-state.service.stub';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { LocalStorageServiceStub } from '../../services/local-storage/local-storage.service.stub';
import { AppTypes, DataDirectionType, InputAppDto } from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';

export interface TestValueType {
  someKey: string
}

export interface TestStateType {
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
  let mockInputData: InputAppDto;
  let getLocalStorageSpy;
  let setStateSpy;
  let key: string;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAppComponent ],
      providers: [
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
      value: '{"value": "", "state": ""}',
      callbackRedirectUrl: '/some/redirect/url',
      isPrevStepCase: false
    };

    fixture = TestBed.createComponent(TestAppComponent);
    cfAppStateService = TestBed.inject(CfAppStateService);
    localStorageService = TestBed.inject(LocalStorageService);
    appStateService = TestBed.inject(AppStateService);
    appStateQuery = TestBed.inject(AppStateQuery);
    locationService = TestBed.inject(LocationService);
    jest.spyOn(cfAppStateService, 'getState').mockReturnValue(mockInputData);
    jest.spyOn(appStateQuery, 'storeState', 'get').mockReturnValue(JSON.parse(mockInputData.value));
    getLocalStorageSpy = jest.spyOn(localStorageService, 'get').mockReturnValue(null);
    setStateSpy = jest.spyOn(cfAppStateService, 'setState');
    component = fixture.componentInstance;
    fixture.detectChanges();
    key = `APP_STORAGE_${mockInputData.componentType.toUpperCase()}_${mockInputData.componentId.toUpperCase()}`;
  });

  describe('openApp()', () => {
    it('should set inputAppData', () => {
      component.openApp();
      expect(component.inputAppData).toBe(mockInputData);
    });

    it('should throw error if input types not equal app type', () => {
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

    it('should call appStateService with state from input data if there is no stateFromStorage', () => {
      const initializeSpy = jest.spyOn(appStateService, 'initialize');
      component.openApp();
      expect(initializeSpy).toBeCalledWith(JSON.parse(mockInputData.value));
    });

    it('should subscribe on update app state', () => {
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

    it('should call setState of cfAppStateService and pass outputData when there is not isPrevStepCase', () => {
      component.closeApp();
      expect(setStateSpy).toBeCalledWith(expectedOutputData, DataDirectionType.OUTPUT);
    });

    it('should call setState of cfAppStateService and pass outputData when there is isPrevStepCase', () => {
      expectedOutputData.isPrevStepCase = true;
      component.closeApp(true);
      expect(setStateSpy).toBeCalledWith(expectedOutputData, DataDirectionType.OUTPUT);
    });

    it('should call unsubscribe on synchronization subscription', () => {
      const unsubscribeSpy = jest.spyOn<any, any>(component['storeSub'], 'unsubscribe');
      component.closeApp();
      expect(unsubscribeSpy).toBeCalled();
    });

    it('should call delete local app state storage with key', () => {
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
