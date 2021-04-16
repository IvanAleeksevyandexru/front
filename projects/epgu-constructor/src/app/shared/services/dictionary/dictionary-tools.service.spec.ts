import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { cloneDeep } from 'lodash';
import { mockSelectMapObjectStore } from '../../../component/unique-screen/components/select-map-object/mocks/mock-select-map-object';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryApiService } from './dictionary-api.service';
import { DictionaryToolsService } from './dictionary-tools.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { ScreenStore } from '../../../screen/screen.types';
import {
  CustomComponent,
  CustomListDictionaries,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { UtilsService as utils } from '../../../core/services/utils/utils.service';
import set = Reflect.set;
import { configureTestSuite } from 'ng-bullet';
import { ScenarioDto } from 'epgu-constructor-types/dist/base/scenario';
import { DictionaryConditions } from 'epgu-constructor-types/dist/base/dictionary';

const getDictionary = (count = 0) => {
  const items = [];

  for (let i = 0; i < count; i += 1) {
    items.push({
      value: `R780000${i}`,
    });
  }

  return {
    error: { code: 0, message: 'operation completed' },
    fieldErrors: [],
    total: items.length,
    items,
  };
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
        valueType: 'value',
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 'true' });
    });

    it('should calc valueType preset', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'regCode',
        valueType: 'preset',
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
        valueType: 'root',
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: 763712529 });
    });

    it('should calc valueType root', () => {
      const dFilter = {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'pd4.value.regAddr.kladrCode',
        valueType: 'ref',
      };
      const valueForFilter = service['getValueForFilter'](compValue, MapStore, dFilter);
      expect(valueForFilter).toEqual({ asString: '77000000000358800' });
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
      }).toThrowError(`Неверный valueType для фильтров карты - ${dFilter.valueType}`);
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

  describe('isResultEmpty()', function () {
    const setup = (componentType: string, dictionaryItems: Array<object> = []) => {
      const component = ({
        id: 'test',
        type: componentType,
        attrs: {
          dictionaryType: 'TEST',
        }
      } as any) as CustomComponent;
      const dictionaryId = utils.getDictKeyByComp(component);
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
});
