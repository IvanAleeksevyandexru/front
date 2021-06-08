import { Component, Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    fixture = TestBed.createComponent(TestAppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
