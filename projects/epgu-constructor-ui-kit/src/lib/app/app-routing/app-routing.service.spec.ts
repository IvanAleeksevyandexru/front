import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppRoutingService } from './app-routing.service';
import { AppStateQuery } from '../app-state/app-state.query';
import { AppRouterState } from '@epgu/epgu-constructor-types';
import { AppStateQueryStub } from '../app-state/app-state.query.stub';
import { Component } from '@angular/core';
import { from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  template: '<div>test</div>',
})
class TestComponent {}

@Component({
  template: '<div>test2</div>',
})
class Test2Component {}

describe('AppRoutingService', () => {
  let service: AppRoutingService;
  let appStateQuery: AppStateQuery<unknown, AppRouterState>;
  const routing = {
    test1: TestComponent,
    test2: Test2Component
  };

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        AppRoutingService,
        { provide: AppStateQuery, useClass: AppStateQueryStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AppRoutingService);
    appStateQuery = TestBed.inject(AppStateQuery);
  });

  describe('initRouting()', () => {
    it('should set appRoutingComponentMap', () => {
      expect(service['appRoutingComponentMap']).toBeUndefined();
      service.initRouting(routing);
      expect(service['appRoutingComponentMap']).toBe(routing);
    });
  });

  describe('component$', () => {
    beforeEach(() => {
      service.initRouting(routing);
    });

    it('should return component', (done) => {
      const currentComponent = 'test2';
      service['state$'] = from([{}, { currentComponent }]) as unknown as Observable<AppRouterState>;
      service.component$.subscribe((component) => {
        expect(component).toBe(Test2Component);
        done();
      });
    });

    it('should return undefined component', (done) => {
      const currentComponent = 'test3';
      service['state$'] = from([{}, { currentComponent }]) as unknown as Observable<AppRouterState>;
      service.component$.subscribe((component) => {
        expect(component).toBeUndefined();
        done();
      });
    });

    it('shouldn\'t trigger twice if have the same currentComponent', (done) => {
      const currentComponent = 'test2';
      const mockFunc = jest.fn(() => true);
      service['state$'] = from([{ currentComponent }, { currentComponent }, { currentComponent: 'test1' }]) as unknown as Observable<AppRouterState>;
      service.component$.subscribe((component) => {
        mockFunc();
      }, () => true, () => {
        expect(mockFunc).toBeCalledTimes(2);
        done();
      });
    });
  });
});
