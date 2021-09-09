import { TestBed } from '@angular/core/testing';
import { EaisdoGroupCostService } from './eaisdo-group-cost.service';
import { configureTestSuite } from 'ng-bullet';
import {
  EaisdoFinancialSourceTypes,
  EaisdoResponseTypes,
  EaisdoStateTypes,
  EaisdoTypeOfBudgetTypes,
} from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import { ActionType, ScreenButton } from '@epgu/epgu-constructor-types';
import { DTOActionAction } from '@epgu/epgu-constructor-types';
import { CertificateEaisdoService } from '../certificate-eaisdo/certificate-eaisdo.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { cloneDeep } from 'lodash';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

describe('EaisdoGroupCostService', () => {
  let service: EaisdoGroupCostService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        EaisdoGroupCostService,
        CertificateEaisdoService,
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
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

  describe('calculateVisibility()', () => {
    it('should set button hidden attr to true, if currentButtonsState does not include that button', () => {
      const button: ScreenButton = {
        type: ActionType.nextStep,
        action: DTOActionAction.getNextStep,
        label: '',
        hidden: false,
      };
      const result = cloneDeep(button);
      service['isInformerScreen'] = true;
      service.currentButtonsState = [ActionType.quizToOrder];
      service['calculateVisibility'](button);
      expect(button).not.toEqual(result);
    });
    it('should set button hidden attr to false, if currentButtonsState include that button', () => {
      const button: ScreenButton = {
        type: ActionType.nextStep,
        action: DTOActionAction.getNextStep,
        label: '',
        hidden: false,
      };
      const result = cloneDeep(button);
      service['isInformerScreen'] = true;
      service.currentButtonsState = [ActionType.nextStep];
      service['calculateVisibility'](button);
      expect(button).toEqual(result);
    });
  });
});
