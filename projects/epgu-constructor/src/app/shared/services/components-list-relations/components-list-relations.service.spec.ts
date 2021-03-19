import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { ConfigService } from '../../../core/services/config/config.service';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import {
  CustomComponent,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomListDictionaries,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes,
} from '../../components/components-list/components-list.types';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { ComponentsListRelationsService } from './components-list-relations.service';

describe('ComponentsListRelationsService', () => {
  let service: ComponentsListRelationsService;
  let mockComponent: CustomComponent = {
    id: 'rf1',
    type: CustomScreenComponentTypes.StringInput,
    label: 'Прежняя фамилия',
    attrs: {
      dictionaryType: '',
      ref: [
        {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOn,
        },
      ],
      labelAttr: '',
      fields: [],
      validation: [
        {
          type: 'RegExp',
          value: '^.{0,10}$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле может содержать не более 10 символов',
          updateOn: 'change',
        },
        {
          type: 'RegExp',
          value: '^[-а-яА-ЯЁё0-9 .,/]+$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg:
            'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
          updateOn: 'change',
        },
        {
          type: 'RegExp',
          value: '^.{9}$',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле должно содержать 9 символов',
          updateOn: 'blur',
        },
        {
          type: 'RegExp',
          value: '.*[0-9]+.*',
          ref: '',
          dataType: '',
          condition: '',
          errorMsg: 'Поле должно содержать хотя бы одну цифру',
          updateOn: 'blur',
        },
      ],
    },
    value: '',
    required: true,
  };
  let mockComponents: CustomComponent[] = [mockComponent];
  let mockShownElements: CustomListStatusElements = {
    rf1: {
      isShown: true,
      relation: CustomComponentRefRelation.disabled,
    }
  };
  let mockForm: FormArray;
  let mockDictionaries: CustomListDictionaries;
  let screenService: ScreenService;
  let dictionaryToolsService: DictionaryToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
        HttpClient,
        HttpHandler,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
        DictionaryApiService,
        ConfigService,
        LoggerService,
      ],
    });

    service = TestBed.inject(ComponentsListRelationsService);
    screenService = TestBed.inject(ScreenService);
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
  });

  describe('filters()', () => {
    it('should be inited', () => {
      expect(service.filters).toBeTruthy();
      expect(service.filters$).toBeTruthy();
    });
  });

  xdescribe('getUpdatedShownElements()', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  xdescribe('createStatusElements()', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  xdescribe('updateStatusElements()', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('hasRelation()', () => {
    it('should return true, if component has identic relation', () => {
      const relation = CustomComponentRefRelation.displayOn;
      expect(service.hasRelation(mockComponent, relation)).toBe(true);
    });
    it('should return false, if component has no identic relation', () => {
      const relation = CustomComponentRefRelation.displayOff;
      expect(service.hasRelation(mockComponent, relation)).toBe(false);
    });
  });

  describe('isComponentDependent()', () => {
    it('should return true, if component is dependent', () => {
      expect(service.isComponentDependent(mockComponent.attrs.ref, mockComponent)).toBe(true);
    });
    it('should return false, if component is not dependent', () => {
      const component = JSON.parse(JSON.stringify(mockComponent));
      component.attrs.ref[0].relatedRel = 'pd4';
      expect(service.isComponentDependent(component.attrs.ref, mockComponent)).toBe(false);
    });
  });

  describe('getDependentComponents()', () => {
    it('should return array of components with dependency', () => {
      expect(service.getDependentComponents(mockComponents, mockComponent)).toEqual([mockComponent]);
    });
  });

  xdescribe('getDictionaryAttributeValue()', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getRelation()', () => {
    it('should return reference relation found by component relation', () => {
      const component = mockComponent;
      const reference = {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      };
      expect(service.getRelation(component, reference)).toEqual(reference);
    });
  });

  xdescribe('getValueFromRelationComponent()', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  xdescribe('getCalcValueFromRelation()', () => {
    it('should return empty string, if not all components have valid values', () => {
      expect(service.getCalcValueFromRelation(itemRef, components, form)).toBe('');
    });
    it('should return number calculated by formula, if components have valid values', () => {
      expect(service.getCalcValueFromRelation(itemRef, components, form)).toBe(2);
    });
  });

  describe('getCalcFieldValue()', () => {
    it('should return number calculated from passed string formula', () => {
      expect(service.getCalcFieldValue('(50 + 150) / 100')).toBe(2);
    });
  });

  describe('getValueFromComponentVal()', () => {
    it('should return component string value, if arg is string', () => {
      const value = 'value';
      expect(service.getValueFromComponentVal(value)).toBe(value);
    });
    it('should return component string value, if arg is {id: string}', () => {
      const value = { id: 'value' };
      expect(service.getValueFromComponentVal(value)).toBe('value');
    });
  });

  describe('isValueEquals()', () => {
    it('should return false, if value is empty and componentValue is not empty', () => {
      expect(service.isValueEquals('', { id: 'value' })).toBe(false);
    });
    it('should return true, if value is not empty and componentValue is not empty', () => {
      expect(service.isValueEquals('*', { id: 'value' })).toBe(true);
    });
    it('should return true, if value is array and some items equals to componentValue', () => {
      expect(service.isValueEquals(['value', 'non_value'], { id: 'value' })).toBe(true);
    });
    it('should return false, if value is array and none items are equal to componentValue', () => {
      expect(service.isValueEquals(['values', 'non_value'], { id: 'value' })).toBe(false);
    });
    it('should return true, if value is string and componentValue has equal string', () => {
      expect(service.isValueEquals('value', { id: 'value' })).toBe(true);
    });
  });

  describe('applyFilter()', () => {
    it('should apply passed filter for dependent component', () => {
      const dependentComponentId = mockComponent.id;
      const filter = { pageNum: 0, simple: { value: { asString: 'value' }, condition: 'CONTAINS', attributeName: 'value' }};
      const componentVal = { id: 'value' };
      service.applyFilter(dependentComponentId, filter, componentVal);
      expect(service.filters[dependentComponentId]).toEqual(filter);
    });
  });

  describe('clearFilter()', () => {
    it('should clear filter for passped dependent component', () => {
      const dependentComponentId = mockComponent.id;
      service.filters[dependentComponentId] = { pageNum: 0 };
      service.clearFilter(dependentComponentId);
      expect(service.filters[dependentComponentId]).toBeNull();
    });
  });
});