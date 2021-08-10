import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { of } from 'rxjs';
import { cloneDeep } from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import {
  ScenarioDto,
  DictionaryConditions,
  DictionaryValueTypes,
  AttributeTypes,
} from '@epgu/epgu-constructor-types';
import {
  ConfigService,
  ConfigServiceStub,
  mockSelectMapObjectStore
} from '@epgu/epgu-constructor-ui-kit';

import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryApiService } from './dictionary-api.service';
import { DictionaryToolsService } from './dictionary-tools.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { ScreenStore } from '../../../screen/screen.types';
import {
  CustomComponent,
  CustomComponentAttr,
  CustomListDictionaries,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { getDictKeyByComp } from './dictionary-helper';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { MockProvider } from 'ng-mocks';

const getDictionary = (count = 0) => {
  const items = [];

  for (let i = 0; i < count; i += 1) {
    items.push({
      value: `R780000${i}`,
      title: `TITLE_FOR_R780000${i}`,
    });
  }

  return {
    error: { code: 0, message: 'operation completed' },
    fieldErrors: [],
    total: items.length,
    items,
  };
};

const form = {
  value: [
    {
      type: 'DateInput',
      id: 'act3',
      label: 'Дата актовой записи',
      required: true,
      value: new Date('2021-04-08T00:00:00.000Z'),
    },
    {
      type: 'StringInput',
      id: 'act2',
      label: 'Номер актовой записи',
      required: true,
      value: 'test',
    },
    {
      type: 'Lookup',
      id: 'act4',
      label: 'Орган ЗАГС, составивший актовую запись',
      required: true,
      value: '',
    },
  ],
};

describe('DictionaryToolsService', () => {
  let service: DictionaryToolsService;
  let MapStore: ScenarioDto;
  let compValue;
  const component: CustomComponent = {
    id: 'dict2',
    type: CustomScreenComponentTypes.DropDownDepts,
    label: 'Информационный центр',
    attrs: {
      dictionaryType: 'FNS_ZAGS_ORGANIZATION_AREA',
      lockedValue: true,
      repeatWithNoFilters: true,
      dictionaryFilter: [
        {
          attributeName: 'SHOW_ON_MAP',
          condition: DictionaryConditions.EQUALS,
          value: '{"asString":"true"}',
          valueType: 'value',
        },
        {
          attributeName: 'SOLEMN',
          condition: DictionaryConditions.EQUALS,
          value: '{"asString":"true"}',
          valueType: 'value',
        },
        {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'regCode',
          valueType: 'preset',
        },
        {
          attributeName: 'PR2',
          condition: DictionaryConditions.EQUALS,
          value: '{"asString":"true"}',
          valueType: 'value',
        },
      ],
      secondaryDictionaryFilter: [
        {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'regCode',
          valueType: 'preset',
        },
      ],
      ref: [],
      defaultIndex: 0,
    },
    value: '',
    required: true,
  };
  const screenStore: ScreenStore = {};

  const setup = (
    componentType: string,
    dictionaryItems: object[] = [],
    attrs: Partial<CustomComponentAttr> = {},
  ) => {
    const component = ({
      id: 'test',
      type: componentType,
      attrs: {
        dictionaryType: 'TEST',
        ...attrs,
      },
    } as any) as CustomComponent;
    const dictionaryId = getDictKeyByComp(component);
    const dictionaryData = {
      loading: false,
      paginationLoading: false,
      data: [],
      origin: component,
      list: dictionaryItems,
    };

    const dictionaries = ({
      [dictionaryId]: dictionaryData,
    } as any) as CustomListDictionaries;

    return {
      component,
      dictionaryId,
      dictionaryData,
      dictionaries,
    };
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
        MockProvider(DateRestrictionsService),
        JsonHelperService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DictionaryToolsService);
    MapStore = cloneDeep(mockSelectMapObjectStore);
    compValue = JSON.parse(MapStore.display.components[0].value);
  });

  describe('getValueForFilter()', () => {
    it('should calc valueType value', () => {
      const dFilter = {
        attributeName: 'SHOW_ON_MAP',
        condition: DictionaryConditions.EQUALS,
        value: '{"asString":"true"}',
        valueType: DictionaryValueTypes.value,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 'true' });
    });

    it('should calc valueType preset', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'regCode',
        valueType: DictionaryValueTypes.preset,
      };
      const compValue = JSON.parse(MapStore.display.components[0].value);
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 'R77' });
    });

    it('should calc valueType root', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'orderId',
        valueType: DictionaryValueTypes.root,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 763712529 });
    });

    it('should calc valueType ref', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'pd4.value.regAddr.kladrCode',
        valueType: DictionaryValueTypes.ref,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: '77000000000358800' });
    });

    it('should calc valueType rawFilter', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'searchString',
        valueType: DictionaryValueTypes.rawFilter,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 'searchString' });
    });

    it('should calc valueType formValue with date', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'act3',
        valueType: DictionaryValueTypes.formValue,
        dateFormat: 'yyyy-MM-dd',
      };
      const valueForFilter = service['getValueForFilter'](form as FormArray, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: '2021-04-08' });
    });

    it('should calc valueType formValue with string', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'act2',
        valueType: DictionaryValueTypes.formValue,
      };
      const valueForFilter = service['getValueForFilter'](form as FormArray, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 'test' });
    });

    it('should calc valueType INVALID_VALUE_TYPE', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'pd4.value.regAddr.kladrCode',
        valueType: 'INVALID_VALUE_TYPE',
      };
      expect(() => {
        service['getValueForFilter'](compValue, MapStore, dFilter);
      }).toThrowError(`Неверный valueType для фильтров - ${dFilter.valueType}`);
    });
  });

  describe('getDictKeyByComp()', () => {
    it('should return dictionary key by component', () => {
      expect(getDictKeyByComp(
        { attrs: { dictionaryType: 'testType' }, id: 1 } as any))
        .toBe('testType1');
    });
  });

  describe('getDropDownDepts$()', () => {
    describe('when repeatWithNoFilters is false and there is no items', () => {
      const repeatWithNoFilters = false;
      const patchedComponent = { ...component, attrs: { ...component.attrs, repeatWithNoFilters }};
      const data = {
        component: patchedComponent,
        data: getDictionary(0),
      };

      it('should NOT re-fetch data from nsi dictionary', fakeAsync(() => {
        jest.spyOn(service, 'getDictionaries$').mockReturnValue(of(data));

        service.getDropDownDepts$(patchedComponent, screenStore).subscribe((response) =>
          expect(response).toStrictEqual({
            ...data,
            meta: { repeatedWithNoFilters: false },
          }),
        );
        tick();
      }));
    });

    describe('when repeatWithNoFilters is true', () => {
      const repeatWithNoFilters = true;
      const patchedComponent = { ...component, attrs: { ...component.attrs, repeatWithNoFilters }};

      describe('when there is no items for filtered fetch', () => {
        const data = {
          component: patchedComponent,
          data: getDictionary(0),
        };

        it('should re-fetch data from nsi dictionary', fakeAsync(() => {
          jest.spyOn(service, 'getDictionaries$').mockReturnValue(of(data));

          service.getDropDownDepts$(patchedComponent, screenStore).subscribe((response) =>
            expect(response).toStrictEqual({
              ...data,
              meta: { repeatedWithNoFilters: true },
            }),
          );
          tick();
        }));
      });

      describe('when there is at least one item for filtered fetch', () => {
        const data = {
          component: patchedComponent,
          data: getDictionary(1),
        };

        it('should re-fetch data from nsi dictionary', fakeAsync(() => {
          jest.spyOn(service, 'getDictionaries$').mockReturnValue(of(data));

          service.getDropDownDepts$(patchedComponent, screenStore).subscribe((response) =>
            expect(response).toStrictEqual({
              ...data,
              meta: { repeatedWithNoFilters: false },
            }),
          );
          tick();
        }));
      });
    });
  });

  describe('dropDowns()', () => {
    it('should exists', () => {
      expect('dropDowns' in service).toBe(true);
    });
  });

  describe('adaptDictionaryToListItem()', () => {
    it('should return ListElement with default mapping', () => {
      const items = getDictionary(2).items;
      const actualListItems = service.adaptDictionaryToListItem(items);
      const expectedListItems = [
        {
          id: 'R7800000',
          originalItem: { title: 'TITLE_FOR_R7800000', value: 'R7800000' },
          text: 'TITLE_FOR_R7800000',
        },
        {
          id: 'R7800001',
          originalItem: { title: 'TITLE_FOR_R7800001', value: 'R7800001' },
          text: 'TITLE_FOR_R7800001',
        },
      ];
      expect(expectedListItems).toEqual(actualListItems);
    });

    it('should return ListElement with custom mapping', () => {
      const items = [
        { asd: 'TITLE_FOR_R7800000', zxc: 'R7800000' },
        { asd: 'TITLE_FOR_R7800001', zxc: 'R7800001' },
      ];
      const mappingParams = { idPath: 'zxc', textPath: 'asd' };
      const actualListItems = service.adaptDictionaryToListItem(items, mappingParams);
      const expectedListItems = [
        {
          id: 'R7800000',
          originalItem: { asd: 'TITLE_FOR_R7800000', zxc: 'R7800000' },
          text: 'TITLE_FOR_R7800000',
        },
        {
          id: 'R7800001',
          originalItem: { asd: 'TITLE_FOR_R7800001', zxc: 'R7800001' },
          text: 'TITLE_FOR_R7800001',
        },
      ];
      expect(expectedListItems).toEqual(actualListItems);
    });
  });

  describe('isResultEmpty()', () => {
    it('should throw exception when component not dropdown and not dictionary', () => {
      const { component } = setup('Undefined');
      const isResultEmpty = () => {
        service.isResultEmpty(component);
      };

      expect(isResultEmpty).toThrow(Error);
    });

    it('should return false if there is no dictionary for this component', () => {
      const { component } = setup('Lookup');

      service.dictionaries$.next([]);

      expect(service.isResultEmpty(component)).toBe(false);
    });

    it('should return false if dictionary for this component is not empty', () => {
      const { component, dictionaries } = setup('Dictionary', [{ id: 'data' }]);
      service.dictionaries$.next(dictionaries);

      expect(service.isResultEmpty(component)).toBe(false);
    });

    it('should return false if dictionary for this component is empty', () => {
      const { component, dictionaries } = setup('DropDownDepts');

      service.dictionaries$.next(dictionaries);

      expect(service.isResultEmpty(component)).toBe(true);
    });
  });

  describe('loadReferenceData$', () => {
    it('should use filter from dictionaryOptions if there is no dictionaryFilter', () => {
      const { component } = setup('Lookup', [], {
        dictionaryOptions: {
          parentRefItemValue: '00000000000',
          filter: {
            simple: {
              attributeName: 'Id_Mark',
              condition: DictionaryConditions.EQUALS,
              value: { asString: '123' },
            },
          },
          additionalParams: [],
          excludedParams: [],
        },
      });

      const data = {
        component,
        data: getDictionary(0),
      };

      const getDictionariesSpy = jest.spyOn(service, 'getDictionaries$').mockReturnValue(of(data));

      service.loadReferenceData$([component], {}, {});

      expect(getDictionariesSpy).toBeCalledTimes(1);
      expect(getDictionariesSpy).toBeCalledWith(component.attrs.dictionaryType, component, {
        pageNum: 0,
        ...component.attrs.dictionaryOptions,
      });
    });

    it('should use dictionaryFilter if it exists', () => {
      const { component } = setup('Lookup', [], {
        dictionaryFilter: [
          {
            attributeName: 'ID',
            value: 'dogovor_number.value',
            valueType: 'ref',
            condition: 'EQUALS',
          },
        ],
      });
      const dictionaryOptions = {
        filter: {
          simple: {
            attributeName: 'ID',
            condition: 'EQUALS',
            value: {
              asString: 'val',
            },
          },
        },
        pageNum: 0,
        additionalParams: [],
        excludedParams: [],
      };

      const data = {
        component,
        data: getDictionary(0),
      };

      const getDictionariesSpy = jest.spyOn(service, 'getDictionaries$').mockReturnValue(of(data));

      service.loadReferenceData$(
        [component],
        {},
        { applicantAnswers: { dogovor_number: { value: 'val' }}},
      );

      expect(getDictionariesSpy).toBeCalledTimes(1);
      expect(getDictionariesSpy).toBeCalledWith(
        component.attrs.dictionaryType,
        component,
        dictionaryOptions,
      );
    });

    it('should combine dictionaryFilter and params from dictionaryOptions', () => {
      const { component } = setup('Lookup', [], {
        dictionaryFilter: [
          {
            attributeName: 'ID',
            value: 'dogovor_number.value',
            valueType: 'ref',
            condition: 'EQUALS',
          },
        ],
        dictionaryOptions: {
          parentRefItemValue: '00000000000',
          filter: {
            simple: {
              attributeName: 'Id_Mark',
              condition: DictionaryConditions.EQUALS,
              value: { asString: '123' },
            },
          },
          additionalParams: [],
          excludedParams: [],
        },
      });
      const dictionaryOptions = {
        parentRefItemValue: '00000000000',
        filter: {
          simple: {
            attributeName: 'ID',
            condition: 'EQUALS',
            value: {
              asString: 'val',
            },
          },
        },
        pageNum: 0,
        additionalParams: [],
        excludedParams: [],
      };

      const data = {
        component,
        data: getDictionary(0),
      };

      const getDictionariesSpy = jest.spyOn(service, 'getDictionaries$').mockReturnValue(of(data));

      service.loadReferenceData$(
        [component],
        {},
        { applicantAnswers: { dogovor_number: { value: 'val' }}},
      );

      expect(getDictionariesSpy).toBeCalledTimes(1);
      expect(getDictionariesSpy).toBeCalledWith(
        component.attrs.dictionaryType,
        component,
        dictionaryOptions,
      );
    });
  });

  describe('prepareSimpleFilter', () => {
    it('should pass asString by default', () => {
      const filter = service.prepareSimpleFilter(
        { value: 42 },
        {},
        {
          attributeName: 'TEST',
          condition: 'EQUALS' as DictionaryConditions,
          value: 'value',
          valueType: 'preset',
        },
      );

      expect(filter).toEqual({
        simple: {
          attributeName: 'TEST',
          condition: 'EQUALS',
          value: { asString: 42 },
        },
      });
    });

    it('should pass asDecimal if attributeType is set', () => {
      const filter = service.prepareSimpleFilter(
        { value: 42 },
        {},
        {
          attributeName: 'TEST',
          attributeType: 'asDecimal' as AttributeTypes,
          condition: 'EQUALS' as DictionaryConditions,
          value: 'value',
          valueType: 'preset',
        },
      );

      expect(filter).toEqual({
        simple: {
          attributeName: 'TEST',
          condition: 'EQUALS',
          value: { asDecimal: 42 },
        },
      });
    });
  });

  describe('getFilterOptions', () => {
    it('should return nothing', () => {
      const filter = service.getFilterOptions(
        { value: 42 },
        {},
        undefined
      );

      expect(filter).toEqual({ filter: null });
    });
  });
});
