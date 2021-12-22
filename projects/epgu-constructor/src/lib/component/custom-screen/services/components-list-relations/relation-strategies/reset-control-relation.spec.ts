import { FormArray, FormBuilder } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { ResetControlRelation } from './reset-control-relation';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';

describe('ResetControlRelation', () => {
  let relation: ResetControlRelation;
  let componentVal = { foo: 'bar' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResetControlRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(ResetControlRelation);
  });

  describe('handleResetControl()', () => {
    it('should reset dependent control', () => {
      let { reference, dependentComponent } = setupForRelationStrategy({
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

      relation.handleRelation(dependentComponent, reference, componentVal, mockForm);
      expect(control.value.value).toBeNull();
    });
  });
});
