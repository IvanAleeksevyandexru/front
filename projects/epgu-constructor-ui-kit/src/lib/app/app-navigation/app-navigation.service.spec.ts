import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppNavigationService } from './app-navigation.service';
import { AppStateService } from '../app-state/app-state.service';
import { AppStateServiceStub } from '../app-state/app-state.service.stub';
import { AppNavigationRuleService } from '../app-navigation-rule/app-navigation-rule.service';
import { AppNavigationRuleServiceStub } from '../app-navigation-rule/app-navigation-rule.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';

describe('AppNavigationService', () => {
  let service: AppNavigationService;
  let appStateService: AppStateService<unknown, unknown>;
  let appNavigationRuleService: AppNavigationRuleService;
  let eventBusService: EventBusService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        AppNavigationService,
        EventBusService,
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppNavigationRuleService, useClass: AppNavigationRuleServiceStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AppNavigationService);
    appStateService = TestBed.inject(AppStateService);
    appNavigationRuleService = TestBed.inject(AppNavigationRuleService);
    eventBusService = TestBed.inject(EventBusService);
  });

  describe('next()', () => {
    it('should call updateCurrentComponent if has nextComponent', () => {
      const next = 'nextComponent';
      jest.spyOn(appNavigationRuleService, 'getNext').mockReturnValue(next);
      const spy = jest.spyOn(appStateService, 'updateCurrentComponent');
      service.next();
      expect(spy).toBeCalledWith(next);
    });

    it('should emmit closeApp event with false payload', (done) => {
      jest.spyOn(appNavigationRuleService, 'getNext').mockReturnValue(undefined);
      const spy = jest.spyOn(appStateService, 'updateCurrentComponent');
      eventBusService.on('closeApp').subscribe(payload => {
        expect(payload).toBe(false);
        done();
      });
      service.next();
    });
  });

  describe('next()', () => {
    it('should call updateCurrentComponent if has prevComponent', () => {
      const prev = 'prevComponent';
      jest.spyOn(appNavigationRuleService, 'getPrev').mockReturnValue(prev);
      const spy = jest.spyOn(appStateService, 'updateCurrentComponent');
      service.prev();
      expect(spy).toBeCalledWith(prev);
    });

    it('should emmit closeApp event with false true', (done) => {
      jest.spyOn(appNavigationRuleService, 'getPrev').mockReturnValue(undefined);
      const spy = jest.spyOn(appStateService, 'updateCurrentComponent');
      eventBusService.on('closeApp').subscribe(payload => {
        expect(payload).toBe(true);
        done();
      });
      service.prev();
    });
  });

});
