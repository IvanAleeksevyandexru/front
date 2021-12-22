import { FormArray, FormBuilder } from '@angular/forms';
import { CustomComponent } from '../../../components-list.types';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { CalcRelation } from './calc-relation';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { calcRefMock } from '../../../../../shared/services/ref-relation/ref-relation.mock';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';

describe('CalcRelation', () => {
  let relation: CalcRelation;
  let { reference, dependentComponent, dependentControl, form } = setupForRelationStrategy({
    referenceExtra: { relation: CustomComponentRefRelation.calc },
  });
  let componentVal = { foo: 'bar' };
  let components: CustomComponent[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalcRelation, MockProvider(RefRelationService), MockProvider(JsonHelperService)],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(CalcRelation);
  });

  it('should update dependent control', () => {
    jest.spyOn(relation, 'getCalcValueFromRelation').mockReturnValue('some value');

    relation.handleRelation(dependentComponent, reference, componentVal, form, components);

    expect(dependentControl.get('value').value).toBe('some value');
  });

  describe('getCalcValueFromRelation()', () => {
    const component = createComponentMock({
      value: '4',
    });
    const customComponents = [component];
    let formMock: FormArray;

    it('should return empty string, if not all customComponents have valid values', () => {
      formMock = new FormArray([]);
      expect(relation.getCalcValueFromRelation(calcRefMock, customComponents, formMock)).toBe('');
    });

    it('should return number calculated by formula, if customComponents have valid values', () => {
      const mockForm = new FormBuilder().group({ ...component });
      formMock = new FormArray([mockForm]);
      expect(relation.getCalcValueFromRelation(calcRefMock, customComponents, formMock)).toBe('2');
    });
  });

  describe('getCalcFieldValue()', () => {
    it('should return number calculated from passed string formula', () => {
      expect(relation.getCalcFieldValue('(50 + 150) / 100')).toBe(2);
    });
  });
});
