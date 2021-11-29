import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomComponent } from '../../../components-list.types';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { AutofillFromDictionaryRelation } from './autofill-from-dictionary-relation';
import DictionaryModel from '../../../components/dictionary/DictionaryModel';
import LookupInputModel from '../../../components/lookup-input/LookupInputModel';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';

describe('AutofillFromDictionaryRelation', () => {
  let relation: AutofillFromDictionaryRelation;
  let {
    reference,
    dependentComponent,
    dependentControl,
    form,
    shownElements,
  } = setupForRelationStrategy({
    referenceExtra: { relation: CustomComponentRefRelation.autofillFromDictionary },
    dependentControlValue: 'some value'
  });
  let componentVal = {
    id: 'foo',
    regOkato: '450000',
  };
  let components: CustomComponent[] = [];

  const refRelationService: RefRelationService = MockService(RefRelationService) as unknown as RefRelationService;

  beforeEach(() => {
    relation = new AutofillFromDictionaryRelation(refRelationService);

    dependentComponent = new DictionaryModel(dependentComponent);
    components = [dependentComponent];

    dependentControl.markAsTouched();
  });

  it('should update dependent control if initInitialValues is FALSE', () => {
    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      false,
    );

    // dependentControl не изменился, потому что initInitialValues === FALSE
    expect(dependentControl.touched).toBeTruthy();
    expect(dependentControl.get('value').value).toBe('some value');
  });

  it('should update dependent control if initInitialValues is TRUE', () => {
    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      true,
    );

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
    components[0]['_dictionary$'].next({
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

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      true,
    );

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

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      true,
    );

    expect(dependentControl.touched).toBeFalsy();
    expect(dependentControl.get('value').value).toBe('new value');
  });

  describe('getDictionaryAttributeValue()', () => {
    it('should return attribute value', () => {
      const dictionaryAttributeName = 'someAttributeName';

      const componentId = 'comp1';

      const components = [
        new LookupInputModel(createComponentMock({
          id: 'comp1',
        })),
        new LookupInputModel(createComponentMock({
          id: 'comp2',
        })),
      ];

      const componentVal = { id: 'foo' };

      // undefined потому что в словаре нет нет значения для компонента comp1
      expect(
        relation['getDictionaryAttributeValue'](
          dictionaryAttributeName,
          componentId,
          components,
          componentVal,
        ),
      ).toBeUndefined();

      components[0]['_dictionary$'].next({ list: [
          {
            id: 'foo',
            originalItem: {
              attributeValues: {
                someAttributeName: 'some attribute value',
              },
            },
          },
        ] } as any);
      expect(
        relation['getDictionaryAttributeValue'](
          dictionaryAttributeName,
          componentId,
          components,
          componentVal,
        ),
      ).toBe('some attribute value');
    });
  });
});
