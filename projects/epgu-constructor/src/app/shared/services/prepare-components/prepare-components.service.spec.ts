import { TestBed } from '@angular/core/testing';

import { PrepareComponentsService } from './prepare-components.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../../../core/services/config/config.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { DateRangeService } from '../date-range/date-range.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { CustomComponentRef, CustomComponentRefRelation } from '../../components/components-list/components-list.types';
import { RefRelationService } from '../ref-relation/ref-relation.service';

describe('PrepareComponentsService', () => {
  let service: PrepareComponentsService;
  let components: ComponentDto[];
  let cachedAnswers: CachedAnswers;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CachedAnswersService,
        UtilsService,
        PrepareComponentsService,
        DatesToolsService,
        DictionaryToolsService,
        DictionaryApiService,
        HttpClient,
        HttpHandler,
        ConfigService,
        LoggerService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PrepareComponentsService);
  });

  beforeEach(() => {
    components = [
      { id: 'a1', type: 'HtmlString', attrs: {}},
      { id: 'a2', type: 'HtmlString', attrs: {}},
    ];
    cachedAnswers = {};
  });

  describe('prepareComponents()', () => {
    it('should call loadValueFromCachedAnswer with component from params', () => {
      spyOn<any>(service, 'loadValueFromCachedAnswer').and.callThrough();
      service.prepareComponents(components, cachedAnswers);
      expect(service['loadValueFromCachedAnswer']).toBeCalledWith(components, cachedAnswers);
    });

    it('should call hideComponents with component returned from loadValueFromCachedAnswer method', () => {
      const loadedValueComponents = [
        { id: 'a1', type: 'HtmlString', attrs: {}},
        { id: 'a2', type: 'HtmlString', attrs: {}, value: '' },
      ];
      spyOn<any>(service, 'loadValueFromCachedAnswer').and.returnValue(loadedValueComponents);
      spyOn<any>(service, 'handleRelatedRelComponents').and.callThrough();
      service.prepareComponents(components, cachedAnswers);
      expect(service['handleRelatedRelComponents']).toBeCalledWith(loadedValueComponents, cachedAnswers);
    });

    it('should return components that was returned from handleRelatedRelComponents method', () => {
      const relatedRelComponents = [
        { id: 'a1', type: 'HtmlString', attrs: { hidden: true }},
        { id: 'a2', type: 'HtmlString', attrs: {}, value: '' },
      ];
      spyOn<any>(service, 'handleRelatedRelComponents').and.returnValue(relatedRelComponents);
      const result = service.prepareComponents(components, cachedAnswers);
      expect(result).toBe(relatedRelComponents);
    });
  });

  describe('loadValueFromCachedAnswer()', () => {
    it('should be return Array<ScreenStoreComponentDtoI>', () => {
      const cachedAnswers: CachedAnswers = {
        ai4: {
          visited: true,
          value: 'Ываыавыва',
        },
      };

      const componentMock: ComponentDto = {
        id: 'ai4',
        type: '',
        label: '',
        attrs: {
          components: [
            {
              id: 'rf1',
              type: 'StringInput',
              label: 'Прежняя фамилия',
              attrs: {},
              value: '',
              required: true,
              valueFromCache: true,
            },
          ],
        },
        value: '',
        required: true,
        valueFromCache: true,
      };

      const components = { ...componentMock, value: 'Ываыавыва', presetValue: '' };
      const componentDtoIS = service['loadValueFromCachedAnswer']([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([components]);
    });
  });

  describe('loadValueFromCachedAnswer() for RepeatableFields', () => {
    it('should be return Array<ScreenStoreComponentDtoI>', () => {
      const cachedAnswers: CachedAnswers = {
        ai4: {
          visited: true,
          value: '[{"rf1":"Ываыавыва"}]',
        },
      };
      const componentMock: ComponentDto = {
        id: 'ai4',
        type: 'RepeatableFields',
        label: '',
        attrs: {
          components: [
            {
              id: 'rf1',
              type: 'StringInput',
              label: 'Прежняя фамилия',
              attrs: {},
              value: '',
              required: true,
              valueFromCache: false,
            },
          ],
        },
        value: '',
        required: true,
        valueFromCache: false,
      };
      const repeatableComponents = { ...componentMock };
      repeatableComponents.attrs.repeatableComponents = [
        [
          {
            id: 'rf1',
            type: 'StringInput',
            label: 'Прежняя фамилия',
            attrs: {},
            value: 'Ываыавыва',
            required: true,
            valueFromCache: false,
          },
        ],
      ];

      const componentDtoIS = service['loadValueFromCachedAnswer']([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([repeatableComponents]);
    });

    it('should be return Array<ScreenStoreComponentDtoI> if cache empty', () => {
      const cachedAnswers: CachedAnswers = {};
      const componentMock: ComponentDto = {
        id: 'ai4',
        type: 'RepeatableFields',
        label: '',
        attrs: {
          components: [
            {
              id: 'rf1',
              type: 'StringInput',
              label: 'Прежняя фамилия',
              attrs: {},
              value: '',
              required: true,
              valueFromCache: false,
            },
          ],
        },
        value: '',
        required: true,
        valueFromCache: false,
      };
      const repeatableComponents = { ...componentMock };
      repeatableComponents.attrs.repeatableComponents = [
        [
          {
            id: 'rf1',
            type: 'StringInput',
            label: 'Прежняя фамилия',
            attrs: {},
            value: '',
            required: true,
            valueFromCache: false,
          },
        ],
      ];

      const componentDtoIS = service['loadValueFromCachedAnswer']([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([repeatableComponents]);
    });
  });

  describe('loadValueFromCachedAnswer() for refDate', () => {
    const cachedAnswers: CachedAnswers = {
      pd1: {
        visited: true,
        disabled: false,
        value: '12.12.2020',
      },
      pd2: {
        visited: true,
        disabled: false,
        value: '{date: 15.12.2020}',
      },
    };

    it('should be return minDate, maxDate if has minRefDate, maxDateRef', () => {
      const componentMock: ComponentDto = {
        id: 'ai4',
        type: '',
        label: '',
        attrs: {
          components: [
            {
              id: 'rf1',
              type: 'DateInput',
              label: 'Прежняя фамилия',
              attrs: {
                minDate: '-30y',
                maxDate: 'today',
                minDateRef: 'pd1.value',
                maxDateRef: 'pd2.value.date',
              },
              value: '',
              required: true,
              valueFromCache: false,
            },
          ],
        },
        value: '',
        required: true,
        valueFromCache: false,
      };

      const component = { ...componentMock, presetValue: '' };
      component.attrs.maxDate = '15.12.2020';
      component.attrs.minDate = '12.12.2020';

      const componentDtoIS = service['loadValueFromCachedAnswer']([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([component]);
    });

    it('should be return minDate, maxDate for DocInput', () => {
      const componentMock: any = {
        id: 'zp1',
        type: 'DocInput',
        label: 'Загранпаспорт',
        attrs: {
          fields: {
            date: {
              type: 'date',
              label: 'Дата выдачи',
              required: true,
              attrs: {
                minDateRef: 'pd1.value',
                maxDateRef: 'pd2.value.date',
              },
            },
          },
        },
        value: '',
        required: true,
        valueFromCache: false,
      };

      const component = { ...componentMock, presetValue: '' };
      component.attrs.fields.date.attrs.maxDate = '15.12.2020';
      component.attrs.fields.date.attrs.minDate = '12.12.2020';

      const componentDtoIS = service['loadValueFromCachedAnswer']([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([component]);
    });
  });

  describe('Other cases', () => {
    it('should put value to filter object in attrs', () => {
      const attrs = {
        dictionaryOptions: {
          filter: {
            simple: {
              attributeName: 'title',
              condition: 'CONTAINS',
              value: {
                asString: '${testVal}',
              },
            },
          },
        },
      };

      const expectedAttrs = {
        dictionaryOptions: {
          filter: {
            simple: {
              attributeName: 'title',
              condition: 'CONTAINS',
              value: {
                asString: 'Some value',
              },
            },
          },
        },
      };

      const actualAttrs = service['putValueToFilters']('testVal', 'Some value', attrs);

      expect(actualAttrs).toEqual(expectedAttrs);
    });

    it('should set filter in attrs', () => {
      const cachedAnswers = {
        pd1: { value: '{"storedValues":{"middleName": "Middle"} }' },
      } as any as CachedAnswers;

      const attrs = {
        dictionaryOptions: {
          filter: {
            simple: {
              attributeName: 'title',
              condition: 'CONTAINS',
              value: {
                asString: '${testVal}',
              },
            },
          },
        },
        refs: {
          testVal: 'pd1.value.storedValues.middleName',
        },
      };

      const expectedAttrs = {
        dictionaryOptions: {
          filter: {
            simple: {
              attributeName: 'title',
              condition: 'CONTAINS',
              value: {
                asString: 'Middle',
              },
            },
          },
        },
        refs: {
          testVal: 'pd1.value.storedValues.middleName',
        },
      };

      const actualAttrs = service['setAttrsFilters'](attrs, cachedAnswers);

      expect(actualAttrs).toEqual(expectedAttrs);
    });
  });

  describe('handleRelatedRelComponents()', () => {
    const relation = { relatedRel: 's2', relation: CustomComponentRefRelation.displayOff, val: true };
    const prepareRef = () => {
      components[0].attrs.ref = [
        relation
      ];
      cachedAnswers = {
        s2: {
          visited: true,
          value: 'true'
        }
      };
    };

    it('should return components that passed in to params', () => {
      const result = service['handleRelatedRelComponents'](components, cachedAnswers);
      expect(result).toEqual(components);
    });

    it('should return changed components that passed in to params', () => {
      prepareRef();
      spyOn<any>(service, 'handleCustomComponentRef').and.returnValue(
        { id: 'a1', type: 'HtmlString', attrs: { ref: [relation], hidden: true }},
      );
      const result = service['handleRelatedRelComponents'](components, cachedAnswers);
      components[0].attrs.hidden = true;
      expect(result).toEqual(components);
    });

    it('should call once handleRelatedRelComponents', () => {
      prepareRef();
      spyOn<any>(service, 'handleCustomComponentRef').and.callThrough();
      service['handleRelatedRelComponents'](components, cachedAnswers);
      expect(service['handleCustomComponentRef']).toBeCalledTimes(1);
    });

    it('shouldn\'t call handleRelatedRelComponents', () => {
      spyOn<any>(service, 'handleCustomComponentRef').and.callThrough();
      service['handleRelatedRelComponents'](components, cachedAnswers);
      expect(service['handleCustomComponentRef']).toBeCalledTimes(0);
    });

    it('should call handleRelatedRelComponents with params', () => {
      prepareRef();
      spyOn<any>(service, 'handleCustomComponentRef').and.callThrough();
      service['handleRelatedRelComponents'](components, cachedAnswers);
      expect(service['handleCustomComponentRef']).toBeCalledWith(components[0], components[0].attrs.ref, components, cachedAnswers);
    });
  });

  describe('handleCustomComponentRef()', () => {
    const relation = { relatedRel: 's2', relation: CustomComponentRefRelation.displayOff, val: true };
    const prepareRef = () => {
      components[0].attrs.ref = [
        relation
      ];
      cachedAnswers = {
        s2: {
          visited: true,
          value: 'true'
        }
      };
    };

    it('should return component that passed in to params', () => {
      components[0].attrs.ref = [];
      const result = service['handleCustomComponentRef'](
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers
      );
      expect(result).toEqual(components[0]);
    });

    it('should return component with changed component with hidden', () => {
      prepareRef();
      const result = service['handleCustomComponentRef'](
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers
      );
      components[0].attrs.hidden = true;
      expect(result).toEqual(components[0]);
    });

    it('should call hideComponent with params', () => {
      prepareRef();
      spyOn<any>(service, 'hideComponent').and.callThrough();
      service['handleCustomComponentRef'](
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers
      );
      expect(service['hideComponent']).toBeCalledWith(components[0], components[0].attrs.ref[0] as CustomComponentRef[], cachedAnswers);
    });

    it('shouldn\'t call hideComponent', () => {
      spyOn<any>(service, 'hideComponent').and.callThrough();
      components[0].attrs.ref = [];
      service['handleCustomComponentRef'](
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers
      );
      expect(service['hideComponent']).not.toBeCalled();
    });
  });

  describe('hideComponent()', () => {
    const relation = { relatedRel: 's2', relation: CustomComponentRefRelation.displayOff, val: 'v3' };
    const prepareRef = () => {
      components[0].attrs.ref = [
        relation
      ];
      cachedAnswers = {
        s2: {
          visited: true,
          value: 'v3'
        }
      };
    };

    it('shouldn\'t set hidden if cachedAnswers hasn\'t component', () => {
      prepareRef();
      cachedAnswers = {};
      service['hideComponent'](components[0], relation, cachedAnswers);
      expect(components[0].attrs.hidden).toBeFalsy();
    });

    it('shouldn\'t set hidden if value in cachedAnswers not equal', () => {
      prepareRef();
      cachedAnswers.s2.value = 'v42';
      service['hideComponent'](components[0], relation, cachedAnswers);
      expect(components[0].attrs.hidden).toBeFalsy();
    });

    it('should set hidden if value in cachedAnswers is equal', () => {
      prepareRef();
      service['hideComponent'](components[0], relation, cachedAnswers);
      expect(components[0].attrs.hidden).toBeTruthy();
    });
  });
});
