import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  MicroAppStateQuery,
  MicroAppStateService,
  MicroAppStateStore,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../state/state.service';

describe('StateService', () => {
  let service: StateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore
      ],
    });
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clearGroupFilters()', () => {

    it('should call change state with empty filters', () => {
      const spy = jest.spyOn(service, 'changeState');

      service.clearGroupFilters();

      expect(spy).toHaveBeenCalledWith({ groupFilters: {}});
    });

  });

  describe('get groupFilters()', () => {

    it('should return default group filters if group filters is empty', () => {
      const res = service.groupFilters;

      expect(res.hasOwnProperty('nextSchoolYear')).toBe(true);
      expect(res.hasOwnProperty('vendor')).toBe(true);
      expect(Object.keys(res).length).toBe(2);
    });

    it('should return existing group filters if object is not empty', () => {
      service.groupFilters = { age: 42 };

      const res = service.groupFilters;

      expect(res.hasOwnProperty('nextSchoolYear')).toBe(true);
      expect(res.hasOwnProperty('vendor')).toBe(true);
      expect(res.age).toBe(42);
      expect(Object.keys(res).length).toBe(3);
    });

  });

  describe('get programFilters()', () => {

    it('should return default programFilters if programFilters is undefined', () => {
      const res = service.programFilters;

      expect(res).toEqual( {});
    });

    it('should return existing programFilters if programFilters exist', () => {
      service.programFilters = { age: 42 };

      const res = service.programFilters;

      expect(res).toEqual({ age: 42 });
    });

  });

});
