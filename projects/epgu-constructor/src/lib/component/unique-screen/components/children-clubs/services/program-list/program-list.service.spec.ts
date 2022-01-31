import { TestBed } from '@angular/core/testing';

import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from './program-list.service';
import { StateService } from '../state/state.service';
import { StateServiceStub } from '../state/state.service.stub';
import { baseProgramStub } from '../../stubs/projects.stub';
import { Filters } from '../../models/children-clubs.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../screen/current-answers-service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../shared/services/dictionary/dictionary-api.service.stub';

describe('ProgramListService', () => {
  let service: ProgramListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActionServiceStub,
        ProgramListService,
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        UnsubscribeService,
      ],
    }).compileComponents();
    service = TestBed.inject(ProgramListService);
    service.pageSize = 3;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  beforeEach(() => {
    service = TestBed.inject(ProgramListService);
  });

  const programsArray = new Array(13).fill(baseProgramStub);

  it('should fill data behavior subject on subscribe', () => {
    service.subscribeOnFiltersChange();
    service.fullData$.subscribe((value) => {
      if (value) {
        expect(value.length).toBe(18);
        expect(service.isLoading.getValue()).toBeFalsy();
      }
    });
  });

  describe('getNextPage()', () => {
    it('should increase page number', () => {
      service.nextPage();

      expect(service.currentPage).toBe(1);
    });

    it('should return paginated data according to amount of page opened', () => {
      service.fullData.next(programsArray);

      service.nextPage();
      service.nextPage();

      expect(service.paginatedData.getValue().length).toBe(6);
      expect(service.isFinished.getValue()).toBe(false);
    });

    it('should set isFinish to true when all data is loaded', () => {
      service.fullData.next(programsArray);

      service.nextPage();
      service.nextPage();
      service.nextPage();
      service.nextPage();
      service.nextPage();

      expect(service.paginatedData.getValue().length).toBe(13);
      expect(service.isFinished.getValue()).toBe(true);
    });
  });

  describe('resetData()', () => {
    it('should reset specific fields', () => {
      service.resetData();

      expect(service.currentPage).toBe(0);
      expect(service.paginatedData.getValue()).toEqual([]);
      expect(service.autoScroll).toBe(false);
      expect(service.isFinished.getValue()).toBe(false);
      expect(service.isLoading.getValue()).toBe(true);
      expect(service.fullData.getValue()).toEqual([]);
    });
  });

  describe('setData()', () => {
    it('should set full loading to false if current data is empty ', () => {
      service.fullData.next([]);

      service.setData([]);

      expect(service.isLoading.getValue()).toBe(false);
    });

    it('should call next page ', () => {
      const spy = jest.spyOn(service, 'nextPage');

      service.setData([]);

      expect(spy).toHaveBeenCalled();
    });

    it('should set isFinish to true', () => {
      const baseProgramsArray = new Array(3).fill(baseProgramStub);

      service.setData(baseProgramsArray);

      expect(service.isFinished.getValue()).toBeTruthy();
    });

    it('should not set isFinish to true', () => {
      const baseProgramsArray = new Array(4).fill(baseProgramStub);

      service.setData(baseProgramsArray);

      expect(service.isFinished.getValue()).toBeFalsy();
    });
  });

  describe('processFilters()', () => {
    it('should add focus as FocusFilter', () => {
      const state = {
        programFilters: { focus: { id: 'hudozhestvennoe' } },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.focus).toBe('hudozhestvennoe');
    });

    it('should delete focus field if id is null', () => {
      const state = {
        programFilters: { focus: { id: null } },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.hasOwnProperty('focus')).toBe(false);
    });

    it('should add municipality as string', () => {
      const state = {
        programFilters: { municipality: { id: '15' } },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.municipality).toBe('15');
    });

    it('should delete direction field if id is null', () => {
      const state = {
        programFilters: { direction: { id: null } },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.hasOwnProperty('direction')).toBe(false);
    });

    it('should add direction as string', () => {
      const state = {
        programFilters: { direction: { id: '3' } },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.direction).toBe('3');
    });

    it('should delete query if empty', () => {
      const state = {
        programFilters: { query: '' },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.hasOwnProperty('query')).toBe(false);
    });

    it('should not delete query if not empty', () => {
      const state = {
        programFilters: { query: '1' },
      };

      const filters = service.processFilters((state.programFilters as unknown) as Filters);

      expect(filters.hasOwnProperty('query')).toBe(true);
    });
  });
});
