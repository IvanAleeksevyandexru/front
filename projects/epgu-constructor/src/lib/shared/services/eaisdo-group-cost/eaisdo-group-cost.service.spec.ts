import { TestBed } from '@angular/core/testing';
import { EaisdoGroupCostService } from './eaisdo-group-cost.service';
import { configureTestSuite } from 'ng-bullet';
import {
  EaisdoFinancialSourceTypes,
  EaisdoResponseTypes,
  EaisdoStateTypes,
  EaisdoTypeOfBudgetTypes,
} from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';

describe('EaisdoGroupCostService', () => {
  let service: EaisdoGroupCostService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [EaisdoGroupCostService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EaisdoGroupCostService);
  });

  describe('should calculate state', () => {
    it('and return errorTimeOut if error passed', () => {
      const result = EaisdoStateTypes.errorTimeOut;
      const error = { errorType: '' };
      const responseType = null;
      const financialSource = null;
      const typeOfBudget = null;
      expect(service.calculateState(error, responseType, financialSource, typeOfBudget)).toBe(
        result,
      );
    });
    it('and return some business state, if not error passed', () => {
      const result = EaisdoStateTypes.paid;
      const error = null;
      const responseType = EaisdoResponseTypes.groupCostCalculationResponse;
      const financialSource = EaisdoFinancialSourceTypes.paid;
      const typeOfBudget = EaisdoTypeOfBudgetTypes.valued;
      expect(service.calculateState(error, responseType, financialSource, typeOfBudget)).toBe(
        result,
      );
    });
    it('and return some business error, if not error passed', () => {
      const result = EaisdoStateTypes.errorIneffectual;
      const error = null;
      const responseType = EaisdoResponseTypes.groupCostIneffectualResponse;
      const financialSource = EaisdoFinancialSourceTypes.paid;
      const typeOfBudget = EaisdoTypeOfBudgetTypes.valued;
      expect(service.calculateState(error, responseType, financialSource, typeOfBudget)).toBe(
        result,
      );
    });
  });
});
