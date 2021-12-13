import { FormArray, FormBuilder } from '@angular/forms';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { CustomComponent } from '../../../components-list.types';
import { CalcRelation } from './calc-relation';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { calcRefMock } from '../../../../../shared/services/ref-relation/ref-relation.mock';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';

describe('CalcRelation', () => {
  let relation: CalcRelation;
  const {
    reference,
    dependentComponent,
    dependentControl,
    form,
    shownElements,
  } = setupForRelationStrategy({
    referenceExtra: { relation: CustomComponentRefRelation.calc },
  });
  const componentVal = { foo: 'bar' };
  const components: CustomComponent[] = [];
  const refRelationService: RefRelationService = (MockService(
    RefRelationService,
  ) as unknown) as RefRelationService;

  beforeEach(() => {
    relation = new CalcRelation(refRelationService);
  });

  it('should update dependent control', () => {
    jest.spyOn(relation, 'getCalcValueFromRelation').mockReturnValue('some value');

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
    );

    expect(dependentControl.get('value').value).toBe('some value');
  });

  describe('getCalcValueFromRelation()', () => {
    const component = createComponentMock({
      value: '4',
    });
    const testComponents = [component];
    let formMock: FormArray;

    it('should return empty string, if not all components have valid values', () => {
      formMock = new FormArray([]);
      expect(relation.getCalcValueFromRelation(calcRefMock, testComponents, formMock)).toBe('');
    });

    it('should return number calculated by formula, if components have valid values', () => {
      const testForm = new FormBuilder().group({ ...component });
      formMock = new FormArray([testForm]);
      expect(relation.getCalcValueFromRelation(calcRefMock, testComponents, formMock)).toBe('2');
    });
  });

  describe('getCalcFieldValue()', () => {
    it('should return number calculated from passed string formula', () => {
      expect(relation.getCalcFieldValue('(50 + 150) / 100')).toBe(2);
    });
  });
});
