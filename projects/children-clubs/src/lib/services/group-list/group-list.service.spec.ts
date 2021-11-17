import { TestBed } from '@angular/core/testing';

import { ApiService } from '../api/api.service';
import { ApiServiceStub } from '../api/api.service.stub';
import { StateService } from '../state/state.service';
import { StateServiceStub } from '../state/state.service.stub';
import { GroupListService } from './group-list.service';
import { ProgramListService } from '../program-list/program-list.service';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { groupStub } from '../../stubs/projects.stub';
import { ChildrenClubsState } from '../../children-clubs.types';

describe('GroupListService', () => {
  let service: GroupListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupListService,
        ProgramListService,
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: ApiService, useClass: ApiServiceStub },
      ],
    }).compileComponents();
    service = TestBed.inject(GroupListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  beforeEach(() => {
    service = TestBed.inject(GroupListService);
  });

  describe('reset()', () => {
    it('should reset specific fields', () => {
      service.reset();

      expect(service.page$$.getValue()).toBe(0);
      expect(service.isFinish$$.getValue()).toBe(false);
      expect(service.loading$$.getValue()).toBe(true);
      expect(service.data$$.getValue().length).toBe(0);
      expect(service.allData$$.getValue().length).toBe(0);
    });
  });

  describe('resetPagination()', () => {
    it('should reset page number ', () => {
      service.page$$.next(678);

      service.resetPagination();

      expect(service.page$$.getValue()).toBe(0);
    });
  });

  describe('setGroupList()', () => {
    it('should reset page number ', () => {
      const param = [];
      const spy = jest.spyOn(service, 'next');
      service.setGroupList(param);

      expect(service.data).toStrictEqual(param);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('next()', () => {
    const programsArray = new Array(21).fill(groupStub);

    it('should increase page number', () => {
      service.next();

      expect(service.page$$.getValue()).toBe(1);
    });

    it('should return paginated data according to amount of page opened', () => {
      service.allData$$.next(programsArray);

      service.next();
      service.next();

      expect(service.data$$.getValue().length).toBe(20);
      expect(service.isFinish$$.getValue()).toBe(false);
    });

    it('should set isFinish to true when all data is loaded', () => {
      service.data$$.next(programsArray);

      service.next();
      service.next();
      service.next();
      service.next();
      service.next();

      expect(service.data$$.getValue().length).toBe(21);
      expect(service.isFinish$$.getValue()).toBe(true);
    });
  });

  describe('getGroupList()', () => {
    it('should call api and write result to all data', (done) => {
      service.getGroupList(({} as unknown) as ChildrenClubsState).subscribe(() => {
        expect(service.allData$$.getValue().length).toBe(43);
        done();
      });
    });
  });
});
