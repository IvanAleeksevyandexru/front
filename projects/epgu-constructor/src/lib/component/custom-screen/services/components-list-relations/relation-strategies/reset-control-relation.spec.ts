import { FormArray, FormBuilder } from '@angular/forms';
import { MockService } from 'ng-mocks';
import { ResetControlRelation } from './reset-control-relation';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';

describe('ResetControlRelation', () => {
  let relation: ResetControlRelation;
  let componentVal = { foo: 'bar' };
  const refRelationService: RefRelationService = MockService(RefRelationService) as unknown as RefRelationService;

  beforeEach(() => {
    relation = new ResetControlRelation(refRelationService);
  });

  describe('handleResetControl()', () => {
    it('should reset dependent control', () => {
      let {
        reference,
        dependentComponent,
        shownElements,
      } = setupForRelationStrategy({
        referenceExtra: { relatedRel: 'rf1', val: '', relation: 'reset' },
        dependentComponentStatusExtra: { isShown: true },
      });
      const relatedComponent = {
        id: 'acc_org',
        type: 'CheckingAccount',
        required: true,
        label: 'Расчётный счёт',
        attrs: {
          refs: {},
          ref: [{ relatedRel: 'rf1', val: '', relation: 'reset' }],
        },
        value: '',
        visited: false,
      };

      const fb = new FormBuilder();
      const form = fb.group({ ...createComponentMock() });
      const form2 = fb.group({ ...relatedComponent });
      const mockForm = new FormArray([form, form2]);
      const control = mockForm.controls[0];

      relation.handleRelation(
        shownElements,
        dependentComponent,
        reference,
        componentVal,
        mockForm,
      );
      expect(control.value.value).toBeNull();
    });
  });
});
