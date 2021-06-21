import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppStateQuery } from '../app-state/app-state.query';
import { AppStateQueryStub } from '../app-state/app-state.query.stub';
import { AppNavigationRuleService } from './app-navigation-rule.service';

describe('AppNavigationRuleService', () => {
  let service: AppNavigationRuleService;
  let appStateQuery: AppStateQuery<unknown, unknown>;
  const rules = {
    test1: { next: 'test2' },
    test2: {}
  };

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        AppNavigationRuleService,
        { provide: AppStateQuery, useClass: AppStateQueryStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AppNavigationRuleService);
    appStateQuery = TestBed.inject(AppStateQuery);
  });

  describe('initRule()', () => {
    it('should set appNavigationRuleMap', () => {
      expect(service['appNavigationRuleMap']).toBeUndefined();
      service.initRule(rules);
      expect(service['appNavigationRuleMap']).toBe(rules);
    });
  });

  describe('getFirst()', () => {
    it('should return first component', () => {
      service.initRule(rules);
      const firstComponent = service.getFirst();
      expect(firstComponent).toBe('test1');
    });

    it('should throw error when not find first component', () => {
      const rules = {
        test1: { next: 'test2' },
        test2: { next: 'test1' }
      };
      service.initRule(rules);
      expect(() => service.getFirst()).toThrowError();
    });
  });

  describe('getLast()', () => {
    it('should return last component', () => {
      service.initRule(rules);
      const firstComponent = service.getLast();
      expect(firstComponent).toBe('test2');
    });

    it('should throw error when not find last component', () => {
      const rules = {
        test1: { next: 'test2' },
        test2: { next: 'test1' }
      };
      service.initRule(rules);
      expect(() => service.getLast()).toThrowError();
    });
  });

  describe('getNext()', () => {
    it('should return next component', () => {
      service.initRule(rules);
      jest.spyOn(appStateQuery, 'currentComponent', 'get').mockReturnValue('test1');
      const firstComponent = service.getNext();
      expect(firstComponent).toBe('test2');
    });

    it('should return empty component when current is last', () => {
      service.initRule(rules);
      jest.spyOn(appStateQuery, 'currentComponent', 'get').mockReturnValue('test2');
      const firstComponent = service.getNext();
      expect(firstComponent).toBeUndefined();
    });
  });

  describe('getPrev()', () => {
    it('should return prev component', () => {
      service.initRule(rules);
      jest.spyOn(appStateQuery, 'currentComponent', 'get').mockReturnValue('test2');
      const firstComponent = service.getPrev();
      expect(firstComponent).toBe('test1');
    });

    it('should return empty component when current is first', () => {
      service.initRule(rules);
      jest.spyOn(appStateQuery, 'currentComponent', 'get').mockReturnValue('test1');
      const firstComponent = service.getPrev();
      expect(firstComponent).toBeUndefined();
    });
  });
});
