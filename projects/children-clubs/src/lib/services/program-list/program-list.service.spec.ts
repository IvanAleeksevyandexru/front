import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ProgramListService } from './program-list.service';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../api/api.service';
import { ApiServiceStub } from '../api/api.service.stub';
import { StateService } from '../state/state.service';
import { StateServiceStub } from '../state/state.service.stub';
import { baseProgramStub } from '../../stubs/projects.stub';
import { ChildrenClubsState } from '../../children-clubs.types';

describe('ProgramListService', () => {
  let service: ProgramListService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramListService,
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: ApiService, useClass: ApiServiceStub },
      ],
    });
    service = TestBed.inject(ProgramListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  beforeEach(() => {
    service = TestBed.inject(ProgramListService);
  });

  const programsArray = new Array(13).fill(baseProgramStub);

  it('should fill data behavior subject on subscribe', (done) => {
    const spyAdd = jest.spyOn(service, 'add');

    service.load$.subscribe(() => {
      expect(spyAdd).toHaveBeenCalled();
      expect(service.loading$$.getValue()).toBe(false);
      expect(service.data$$.getValue().length).toBe(18);
      done();
    });
  });

  describe('getNextPage()', () => {

    it('should increase page number', () => {
      service.getNextPage();

      expect(service.page$$.getValue()).toBe(1);
    });

    it('should return paginated data according to amount of page opened', () => {
      service.data$$.next(programsArray);

      service.getNextPage();
      service.getNextPage();

      expect(service.paginatedData$.getValue().length).toBe(6);
      expect(service.isFinish$$.getValue()).toBe(false);
    });

    it('should set isFinish to true when all data is loaded', () => {
      service.data$$.next(programsArray);

      service.getNextPage();
      service.getNextPage();
      service.getNextPage();
      service.getNextPage();
      service.getNextPage();

      expect(service.paginatedData$.getValue().length).toBe(13);
      expect(service.isFinish$$.getValue()).toBe(true);
    });

  });

  describe('resetPagination()', () => {

    it('should reset page number and subject array', () => {
      service.data$$.next(programsArray);
      service.getNextPage();

      service.resetPagination();

      expect(service.page$$.getValue()).toBe(0);
      expect(service.paginatedData$.getValue().length).toBe(0);
    });

  });

  describe('reset()', () => {

    it('should reset specific fields', () => {

      service.reset();

      expect(service.page$$.getValue()).toBe(0);
      expect(service.paginatedData$.getValue()).toEqual([]);
      expect(service.autoScroll).toBe(false);
      expect(service.isFinish$$.getValue()).toBe(false);
      expect(service.fullLoading$$.getValue()).toBe(true);
      expect(service.data$$.getValue()).toEqual([]);
    });

  });

  describe('finish()', () => {

    it('should set finish to true', () => {

      service.isFinish$$.next(false);

      service.finish();

      expect(service.isFinish$$.getValue()).toBe(true);
    });

  });

  describe('add()', () => {

    it('should set full loading to false if current data is empty ', () => {
      service.data$$.next([]);

      service.add([]);

      expect(service.fullLoading$$.getValue()).toBe(false);
    });

    it('should call next page ', () => {
      const spy = jest.spyOn(service, 'getNextPage');

      service.add([]);

      expect(spy).toHaveBeenCalled();
    });

  });

  describe('processFilters()', () => {

    it('should add focus as FocusFilter', () => {
      const state = {
        programFilters: { focus: { id: 'hudozhestvennoe' }}
      };

      const { filters } = service.processFilters(state as unknown as ChildrenClubsState);

      expect(filters.focus).toBe('hudozhestvennoe');
    });

    it('should add municipality as string', () => {
      const state = {
        programFilters: { municipality: { id: '15' }}
      };

      const { filters } = service.processFilters(state as unknown as ChildrenClubsState);

      expect(filters.municipality).toBe('15');
    });

    it('should add direction as string', () => {
      const state = {
        programFilters: { direction: { id: '3' }}
      };

      const { filters } = service.processFilters(state as unknown as ChildrenClubsState);

      expect(filters.direction).toBe('3');
    });

    it('should delete query if empty', () => {
      const state = {
        programFilters: { query: '' }
      };

      const { filters } = service.processFilters(state as unknown as ChildrenClubsState);

      expect(filters.hasOwnProperty('query')).toBe(false);
    });

    it('should not delete query if not empty', () => {
      const state = {
        programFilters: { query: '1' }
      };

      const { filters } = service.processFilters(state as unknown as ChildrenClubsState);

      expect(filters.hasOwnProperty('query')).toBe(true);
    });

  });

});
