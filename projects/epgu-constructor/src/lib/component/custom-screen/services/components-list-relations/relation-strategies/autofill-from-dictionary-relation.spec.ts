import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { CustomComponent } from '../../../components-list.types';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { AutofillFromDictionaryRelation } from './autofill-from-dictionary-relation';
import DictionaryModel from '../../../components/dictionary/DictionaryModel';
import LookupInputModel from '../../../components/lookup-input/LookupInputModel';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';

describe('AutofillFromDictionaryRelation', () => {
  let relation: AutofillFromDictionaryRelation;
  let { reference, dependentComponent, dependentControl, form } = setupForRelationStrategy({
    referenceExtra: { relation: CustomComponentRefRelation.autofillFromDictionary },
    dependentControlValue: 'some value',
  });
  const componentVal = {
    id: 'foo',
    regOkato: '450000',
  };
  let components: CustomComponent[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AutofillFromDictionaryRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(AutofillFromDictionaryRelation);

    dependentComponent = new DictionaryModel(dependentComponent);
    components = [dependentComponent];

    dependentControl.markAsTouched();
  });

  it('should update dependent control if initInitialValues is FALSE', () => {
    relation.handleRelation(dependentComponent, reference, componentVal, form, components, false);

    // dependentControl не изменился, потому что initInitialValues === FALSE
    expect(dependentControl.touched).toBeTruthy();
    expect(dependentControl.get('value').value).toBe('some value');
  });

  it('should update dependent control if initInitialValues is TRUE', () => {
    relation.handleRelation(dependentComponent, reference, componentVal, form, components, true);

    // dependentControl изменился, потому что initInitialValues === TRUE
    // value === '', потому что в dictionaries нет нужного словаря
    expect(dependentControl.touched).toBeFalsy();
    expect(dependentControl.get('value').value).toBe(null);
  });

  it('should update dependent control if initInitialValues is TRUE and has dictionary', () => {
    dependentControl = new FormGroup({
      id: new FormControl(dependentComponent.id),
      value: new FormControl('some value'),
    });
    form = new FormArray([dependentControl]);
    dependentControl.markAsTouched();
    components[0] = new LookupInputModel(components[0]);
    components[0].id = 'rf1';
    // @ts-ignore
    components[0]._dictionary$.next({
      list: [
        {
          id: 'foo',
          originalItem: {
            attributeValues: {
              [reference.val as string]: 'some attribute value',
            },
          },
        },
      ],
    } as any);

    relation.handleRelation(dependentComponent, reference, componentVal, form, components, true);

    // dependentControl изменился, потому что initInitialValues === TRUE
    // value === 'some value', потому что в dictionaries есть нужный словарь
    expect(dependentControl.touched).toBeFalsy();
    expect(dependentControl.get('value').value).toBe('some value');
  });

  it('should update dependent control if it is equal empty string', () => {
    // @ts-ignore:No overload matches this call. Ignoring that getDictionaryAttributeValue is private
    jest.spyOn(relation, 'getDictionaryAttributeValue').mockReturnValue('new value');

    dependentControl = new FormGroup({
      id: new FormControl(dependentComponent.id),
      value: new FormControl(''),
    });
    form = new FormArray([dependentControl]);

    relation.handleRelation(dependentComponent, reference, componentVal, form, components, true);

    expect(dependentControl.touched).toBeFalsy();
    expect(dependentControl.get('value').value).toBe('new value');
  });

  describe('getDictionaryAttributeValue()', () => {
    it('should return attribute value', () => {
      const dictionaryAttributeName = 'someAttributeName';

      const componentId = 'comp1';

      const testComponents = [
        new LookupInputModel(
          createComponentMock({
            id: 'comp1',
          }),
        ),
        new LookupInputModel(
          createComponentMock({
            id: 'comp2',
          }),
        ),
      ];

      const testComponentVal = { id: 'foo' };

      // undefined потому что в словаре нет нет значения для компонента comp1
      expect(
        // @ts-ignore
        relation.getDictionaryAttributeValue(
          dictionaryAttributeName,
          componentId,
          testComponents,
          testComponentVal,
        ),
      ).toBeUndefined();

      // @ts-ignore
      testComponents[0]._dictionary$.next({
        list: [
          {
            id: 'foo',
            originalItem: {
              attributeValues: {
                someAttributeName: 'some attribute value',
              },
            },
          },
        ],
      } as any);
      expect(
        // @ts-ignore
        relation.getDictionaryAttributeValue(
          dictionaryAttributeName,
          componentId,
          testComponents,
          testComponentVal,
        ),
      ).toBe('some attribute value');
    });
  });
});
