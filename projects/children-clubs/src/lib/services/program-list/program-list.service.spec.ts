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
import { BaseProgram } from '../../typings';

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

  const program: BaseProgram = {
    uuid: '1',
    name: '1',
    partnerName: '1',
    address: '1',
    imageUrl: '1',
    imageSmallUrl: '1',
    available: true,
    maxAge: 90,
    minAge: 20,
    financingTypes: []
  };

  const programsArray = new Array(13).fill(program);

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

});
