import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MicroAppNavigationService } from './micro-app-navigation.service';
import { MicroAppStateService } from '../micro-app-state/micro-app-state.service';
import { MicroAppStateServiceStub } from '../micro-app-state/micro-app-state.service.stub';
import { MicroAppNavigationRuleService } from '../micro-app-navigation-rule/micro-app-navigation-rule.service';
import { MicroAppNavigationRuleServiceStub } from '../micro-app-navigation-rule/micro-app-navigation-rule.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';

describe('MicroAppNavigationService', () => {
  let service: MicroAppNavigationService;
  let appStateService: MicroAppStateService<unknown, unknown>;
  let appNavigationRuleService: MicroAppNavigationRuleService;
  let eventBusService: EventBusService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        MicroAppNavigationService,
        EventBusService,
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: MicroAppNavigationRuleService, useClass: MicroAppNavigationRuleServiceStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(MicroAppNavigationService);
    appStateService = TestBed.inject(MicroAppStateService);
    appNavigationRuleService = TestBed.inject(MicroAppNavigationRuleService);
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
