import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { cloneDeep } from 'lodash';
import { mockSelectMapObjectStore } from '../../../component/unique-screen/components/select-map-object/mocks/mock-select-map-object';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { ScenarioDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryApiService } from './dictionary-api.service';
import { DictionaryConditions } from './dictionary-api.types';
import { DictionaryToolsService } from './dictionary-tools.service';

describe('DictionaryApiService', () => {
  let service: DictionaryToolsService;
  let MapStore: ScenarioDto;
  let compValue;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
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
});
