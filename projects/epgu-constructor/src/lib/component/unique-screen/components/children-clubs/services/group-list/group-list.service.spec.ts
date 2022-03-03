import { TestBed } from '@angular/core/testing';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../state/state.service';
import { StateServiceStub } from '../state/state.service.stub';
import { GroupListService } from './group-list.service';
import { ProgramListService } from '../program-list/program-list.service';
import { groupStub } from '../../stubs/projects.stub';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import ChildrenClubsListService from '../children-clubs-list.service';

describe('GroupListService', () => {
  let service: GroupListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupListService,
        ProgramListService,
        ChildrenClubsListService,
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        UnsubscribeService,
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

  describe('resetData()', () => {
    it('should reset specific fields', () => {
      service.resetData();

      expect(service.currentPage).toBe(0);
      expect(service.paginatedData.getValue()).toEqual([]);
      expect(service.isFinished.getValue()).toBe(false);
      expect(service.isLoading.getValue()).toBe(true);
      expect(service.fullData.getValue()).toEqual([]);
    });
  });

  describe('setData()', () => {
    it('should reset page number ', () => {
      const param = [];
      const spy = jest.spyOn(service, 'nextPage');
      service.setData(param);

      expect(service.fullData.getValue()).toStrictEqual(param);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('nextPage()', () => {
    const programsArray = new Array(21).fill(groupStub);

    it('should increase page number', () => {
      service.nextPage();

      expect(service.currentPage).toBe(1);
    });

    it('should return paginated data according to amount of page opened', () => {
      service.fullData.next(programsArray);

      service.nextPage();
      service.nextPage();

      expect(service.paginatedData.getValue().length).toBe(13);
      expect(service.isFinished.getValue()).toBe(false);
    });

    it('should set isFinish to true when all data is loaded', () => {
      service.fullData.next(programsArray);

      service.nextPage();
      service.nextPage();
      service.nextPage();
      service.nextPage();
      service.nextPage();

      expect(service.paginatedData.getValue().length).toBe(21);
      expect(service.isFinished.getValue()).toBe(true);
    });
  });
});
