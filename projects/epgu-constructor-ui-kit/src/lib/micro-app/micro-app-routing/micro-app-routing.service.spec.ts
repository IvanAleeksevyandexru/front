import { TestBed } from '@angular/core/testing';
import { MicroAppRoutingService } from './micro-app-routing.service';
import { MicroAppStateQuery } from '../micro-app-state/micro-app-state.query';
import { MicroAppStateQueryStub } from '../micro-app-state/micro-app-state.query.stub';
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

describe('MicroAppRoutingService', () => {
  let service: MicroAppRoutingService;
  let appStateQuery: MicroAppStateQuery<unknown, unknown>;
  const routing = {
    test1: TestComponent,
    test2: Test2Component,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MicroAppRoutingService,
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(MicroAppRoutingService);
    appStateQuery = TestBed.inject(MicroAppStateQuery);
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
      service['currentComponent$'] = (from([currentComponent]) as unknown) as Observable<string>;
      service.component$.subscribe((component) => {
        expect(component).toBe(Test2Component);
        done();
      });
    });

    it('should return undefined component', (done) => {
      const currentComponent = 'test3';
      service['currentComponent$'] = (from([currentComponent]) as unknown) as Observable<string>;
      service.component$.subscribe((component) => {
        expect(component).toBeUndefined();
        done();
      });
    });

    it('shouldn\'t trigger twice if have the same currentComponent', (done) => {
      const currentComponent = 'test2';
      const mockFunc = jest.fn(() => true);
      service['currentComponent$'] = (from([
        currentComponent,
        currentComponent,
        'test1',
      ]) as unknown) as Observable<string>;
      service.component$.subscribe(
        (component) => {
          mockFunc();
        },
        () => true,
        () => {
          expect(mockFunc).toBeCalledTimes(2);
          done();
        },
      );
    });
  });
});
