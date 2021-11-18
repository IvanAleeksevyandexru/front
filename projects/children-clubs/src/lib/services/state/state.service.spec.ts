import { TestBed } from '@angular/core/testing';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from './state.service';
import { FindOptionsGroup, PfdoPaymentFilters, VendorType } from '../../typings';

interface TestState {
  nextSchoolYear: string;
  programFilters: {
    age: number,
  },
  groupFilters: FindOptionsGroup,
}

const testState: TestState = {
  nextSchoolYear: 'true',
  programFilters: {
    age: 42,
  },
  groupFilters: {
    nextSchoolYear: true,
    vendor: VendorType.inlearno,
    isRegistrationOpen: true,
    maxPrice: 20000,
    age: 10,
    inlearnoPayments: {
      free: true,
      certificate: false,
      personalFunds: false,
    }
  }
};

describe('StateService', () => {
  let service: StateService;
  let stateQuery: MicroAppStateQueryStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(StateService);
    stateQuery = TestBed.inject(MicroAppStateQuery);
    jest.spyOn(stateQuery, 'state', 'get').mockReturnValue(testState);
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
      expect(res.hasOwnProperty('isRegistrationOpen')).toBe(true);
      expect(res.hasOwnProperty('maxPrice')).toBe(true);
      expect(res.hasOwnProperty('age')).toBe(true);
      expect(res.hasOwnProperty('inlearnoPayments')).toBe(true);
      expect(Object.keys(res).length).toBe(6);
    });

    it('should return existing group filters if object is not empty', () => {
      const testStateCopy = Object.assign({}, testState);
      testStateCopy.groupFilters.pfdoPayments = ({} as unknown) as PfdoPaymentFilters;
      jest.spyOn(stateQuery, 'state', 'get').mockReturnValue(testStateCopy);

      service.groupFilters = { pfdoPayments: ({} as unknown) as PfdoPaymentFilters };

      const res = service.groupFilters;

      expect(res.hasOwnProperty('nextSchoolYear')).toBe(true);
      expect(res.hasOwnProperty('vendor')).toBe(true);
      expect(res.hasOwnProperty('isRegistrationOpen')).toBe(true);
      expect(res.hasOwnProperty('maxPrice')).toBe(true);
      expect(res.hasOwnProperty('age')).toBe(true);
      expect(res.hasOwnProperty('inlearnoPayments')).toBe(true);
      expect(res.hasOwnProperty('pfdoPayments')).toBe(true);
      expect(Object.keys(res).length).toBe(7);
    });
  });

  describe('get programFilters()', () => {
    it('should return default programFilters if programFilters is undefined', () => {
      jest.spyOn(stateQuery, 'state', 'get').mockReturnValue({});

      const res = service.programFilters;

      expect(res).toEqual({});
    });

    it('should return existing programFilters if programFilters exist', () => {
      service.programFilters = testState.programFilters;

      const res = service.programFilters;

      expect(res).toEqual(testState.programFilters);
    });
  });
});
