import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import {
  ScenarioDto,
  DictionaryConditions,
  DictionaryValueTypes,
  AttributeTypes,
  DictionaryFilters,
} from '@epgu/epgu-constructor-types';
import {
  ConfigService,
  ConfigServiceStub,
  mockSelectMapObjectStore,
} from '@epgu/epgu-constructor-ui-kit';

import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryApiService } from './dictionary-api.service';
import { DictionaryToolsService } from './dictionary-tools.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { getDictKeyByComp } from './dictionary-helper';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { MockProvider } from 'ng-mocks';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';
import { ComponentDictionaryFilters } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.interface';

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
        DateRefService,
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
      const result = { asString: 'true' };
      expect(valueForFilter).toEqual({
        rawValue: result,
        value: result,
      });
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

      expect(valueForFilter).toEqual({ rawValue: 'R77', value: { asString: 'R77' }});
    });

    it('should calc valueType preset and value originalItem.title', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'originalItem.title',
        valueType: DictionaryValueTypes.preset,
      };
      const compValue = JSON.parse(MapStore.display.components[0].value);
      compValue.originalItem = {
        title: 'title77',
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);

      expect(valueForFilter).toEqual({ rawValue: 'title77', value: { asString: 'title77' }});
    });

    it('should calc valueType root', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'orderId',
        valueType: DictionaryValueTypes.root,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ rawValue: 763712529, value: { asString: 763712529 }});
    });

    it('should calc valueType ref', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'pd4.value.regAddr.kladrCode',
        valueType: DictionaryValueTypes.ref,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({
        rawValue: '77000000000358800',
        value: { asString: '77000000000358800' },
      });
    });

    it('should calc valueType ref and patch items == 1', () => {
      expect(
        service['getValueForFilter'](compValue, MapStore, {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'pd4',
          valueType: DictionaryValueTypes.ref,
        }),
      ).toEqual({
        rawValue: undefined,
        value: { asString: undefined },
      });
    });

    it('should calc valueType ref and patch items == 0', () => {
      expect(
        service['getValueForFilter'](compValue, MapStore, {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: '',
          valueType: DictionaryValueTypes.ref,
        }),
      ).toEqual({
        rawValue: undefined,
        value: { asString: undefined },
      });
    });

    it('should calc valueType ref and patch string type', () => {
      expect(
        service['getValueForFilter'](compValue, MapStore, {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'sn2a.value',
          valueType: DictionaryValueTypes.ref,
        }),
      ).toEqual({
        rawValue: 'qwe@qwe.qwe',
        value: { asString: 'qwe@qwe.qwe' },
      });
    });

    it('should calc valueType ref and patch by array', () => {
      expect(
        service['getValueForFilter'](compValue, MapStore, {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'pd1.value.states[1].fields[2].value',
          valueType: DictionaryValueTypes.ref,
        }),
      ).toEqual({
        rawValue: 'Тестовый центр выдачи',
        value: { asString: 'Тестовый центр выдачи' },
      });
    });

    it('should calc valueType ref and patch undefiend', () => {
      expect(
        service['getValueForFilter'](compValue, MapStore, {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'pd1.value.st123',
          valueType: DictionaryValueTypes.ref,
        }),
      ).toEqual({
        rawValue: undefined,
        value: { asString: undefined },
      });
    });

    it('should calc valueType rawFilter', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'searchString',
        valueType: DictionaryValueTypes.rawFilter,
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({
        rawValue: 'searchString',
        value: { asString: 'searchString' },
      });
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
      expect(valueForFilter).toEqual({ rawValue: '2021-04-08', value: { asString: '2021-04-08' }});
    });

    it('should calc valueType formValue with string', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'act2',
        valueType: DictionaryValueTypes.formValue,
      };
      const valueForFilter = service['getValueForFilter'](form as FormArray, MapStore, dFilter);
      expect(valueForFilter).toEqual({ rawValue: 'test', value: { asString: 'test' }});
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
      expect(getDictKeyByComp({ attrs: { dictionaryType: 'testType' }, id: 1 } as any)).toBe(
        'testType1',
      );
    });
  });

  describe('filters$ property', () => {
    it('should be observable', (done) => {
      service.filters$.subscribe((result) => {
        expect(result).toEqual({});
        done();
      });
      expect(service.filters$).toBeInstanceOf(Observable);
    });

    it('should be emitted if set filters property', (done) => {
      const filters: ComponentDictionaryFilters = {
        a: null,
      };

      service.filters = filters;

      service.filters$.subscribe((result) => {
        expect(result).toBe(filters);
        done();
      });
    });
  });

  describe('filters property', () => {
    it('should be {} by default', () => {
      expect(service.filters).toEqual({});
    });
  });

  describe('applyFilter()', () => {
    it('should apply passed filter for dependent component', () => {
      const dependentComponentId = 'rf1';
      // eslint-disable-next-line max-len
      const filter: DictionaryFilters['filter'] = {
        pageNum: 0,
        simple: {
          value: { asString: 'value' },
          condition: DictionaryConditions.CONTAINS,
          attributeName: 'value',
        },
      };
      service.applyFilter(dependentComponentId, filter);
      expect(service.filters[dependentComponentId]).toEqual(filter);
    });
  });

  describe('clearFilter()', () => {
    it('should clear filter for passped dependent component', () => {
      const dependentComponentId = 'rf1';
      service.filters[dependentComponentId] = { pageNum: 0 };
      service.clearFilter(dependentComponentId);
      expect(service.filters[dependentComponentId]).toBeNull();
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
          minLength: undefined,
          rawValue: 42,
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
          minLength: undefined,
          rawValue: 42,
          value: { asDecimal: 42 },
        },
      });
    });
  });

  describe('getFilterOptions', () => {
    it('should return nothing', () => {
      const filter = service.getFilterOptions({ value: 42 }, {}, undefined);

      expect(filter).toEqual({ filter: null });
    });
  });
});
