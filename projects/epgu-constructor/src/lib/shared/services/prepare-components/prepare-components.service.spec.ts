import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  LocalStorageService,
  LocalStorageServiceStub,
  ConfigService,
  LoggerService,
  DownloadService,
  DatesToolsService,
  ObjectHelperService,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  ComponentAttrsDto,
  ComponentDto,
  CustomComponentRefRelation,
} from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { PrepareComponentsService } from './prepare-components.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { CachedAnswers } from '../../../screen/screen.types';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { CustomComponentRef } from '../../../component/custom-screen/components-list.types';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';
import { HelperService } from '@epgu/ui/services/helper';

describe('PrepareComponentsService', () => {
  let service: PrepareComponentsService;
  let components: ComponentDto[];
  let cachedAnswers: CachedAnswers;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CachedAnswersService,
        DownloadService,
        ObjectHelperService,
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
        RefRelationService,
        MockProvider(DateRestrictionsService),
        MockProvider(HelperService),
        JsonHelperService,
        DateRefService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(PrepareComponentsService);
    components = [
      { id: 'a1', type: 'HtmlString', attrs: {} },
      { id: 'a2', type: 'HtmlString', attrs: {} },
    ];
    cachedAnswers = {};
  });

  describe('prepareComponents()', () => {
    it('should call loadValueFromCachedAnswer with component from params', () => {
      const spy = jest.spyOn<any, string>(service, 'loadValueFromCachedAnswer');
      service.prepareComponents(components, cachedAnswers);
      expect(spy).toBeCalledWith(components, cachedAnswers);
    });

    it('should call hideComponents with component returned from loadValueFromCachedAnswer method', () => {
      const loadedValueComponents = [
        { id: 'a1', type: 'HtmlString', attrs: {} },
        { id: 'a2', type: 'HtmlString', attrs: {}, value: '' },
      ];
      jest
        .spyOn<any, string>(service, 'loadValueFromCachedAnswer')
        .mockReturnValue(loadedValueComponents);
      const spy = jest.spyOn<any, string>(service, 'handleRelatedRelComponents');
      service.prepareComponents(components, cachedAnswers);
      expect(spy).toBeCalledWith(loadedValueComponents, cachedAnswers);
    });

    it('should return components that was returned from handleRelatedRelComponents method', () => {
      const relatedRelComponents = [
        { id: 'a1', type: 'HtmlString', attrs: { hidden: true } },
        { id: 'a2', type: 'HtmlString', attrs: {}, value: '' },
      ];
      jest
        .spyOn<any, string>(service, 'handleRelatedRelComponents')
        .mockReturnValue(relatedRelComponents);
      const result = service.prepareComponents(components, cachedAnswers);
      expect(result).toBe(relatedRelComponents);
    });
  });

  describe('loadValueFromCachedAnswer()', () => {
    it('should be return Array<ScreenStoreComponentDtoI>', () => {
      const testCachedAnswers: CachedAnswers = {
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

      const testComponents = { ...componentMock, value: 'Ываыавыва', presetValue: '' };
      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], testCachedAnswers);
      expect(componentDtoIS).toEqual([testComponents]);
    });
  });

  describe('loadValueFromCachedAnswer() for RepeatableFields', () => {
    it('should be return Array<ScreenStoreComponentDtoI>', () => {
      const testCachedAnswers: CachedAnswers = {
        ai4: {
          visited: true,
          value:
            '[{"rf1":"Ываыавыва", "rf2": {"biomStu": false,"verifying": false, "exists": false,"snils": "828-054-296 13"}}]',
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
            {
              id: 'rf2',
              type: 'SnilsInput',
              label: 'Снилс',
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
          {
            id: 'rf2',
            type: 'SnilsInput',
            label: 'Прежняя фамилия',
            attrs: {},
            value: '828-054-296 13',
            required: true,
            valueFromCache: false,
          },
        ],
      ];

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], testCachedAnswers);
      expect(componentDtoIS).toEqual([repeatableComponents]);
    });

    it('should be return Array<ScreenStoreComponentDtoI> if cache empty', () => {
      const testCachedAnswers: CachedAnswers = {};
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], testCachedAnswers);
      expect(componentDtoIS).toEqual([repeatableComponents]);
    });
  });

  describe('loadValueFromCachedAnswer() for RepeatableFields from localStorage', () => {
    it('should return local value if cacheRepeatableFieldsAnswersLocally is TRUE', () => {
      const testCachedAnswers = {
        ai4: [{ rf1: 'Ываыавыва' }],
      };
      localStorage.setItem('cachedAnswers', JSON.stringify(testCachedAnswers));

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
          cacheRepeatableFieldsAnswersLocally: true,
        },
        value: '',
        required: true,
        valueFromCache: false,
      };

      const repeatableComponents: ComponentDto = {
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
          repeatableComponents: [
            [
              {
                id: 'rf1',
                type: 'StringInput',
                label: 'Прежняя фамилия',
                attrs: {},
                value: 'Ываыавыва',
                required: true,
                valueFromCache: true,
                presetValue: '',
              },
            ],
          ],
          cacheRepeatableFieldsAnswersLocally: true,
        },
        value: '',
        required: true,
        valueFromCache: false,
      };

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], {});
      expect(componentDtoIS).toEqual([repeatableComponents]);
      localStorage.removeItem('cachedAnswers');
    });

    it('should not return local value if cacheRepeatableFieldsAnswersLocally is FALSE', () => {
      const testCachedAnswers = {
        ai4: [{ rf1: 'Ываыавыва' }],
      };
      localStorage.setItem('cachedAnswers', JSON.stringify(testCachedAnswers));

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
          cacheRepeatableFieldsAnswersLocally: false,
        },
        value: '',
        required: true,
        valueFromCache: false,
      };

      const repeatableComponents: ComponentDto = {
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
          repeatableComponents: [
            [
              {
                id: 'rf1',
                type: 'StringInput',
                label: 'Прежняя фамилия',
                attrs: {},
                value: '',
                required: true,
                valueFromCache: false,
                presetValue: '',
              },
            ],
          ],
          cacheRepeatableFieldsAnswersLocally: false,
        },
        value: '',
        required: true,
        valueFromCache: false,
      };

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], {});
      expect(componentDtoIS).toEqual([repeatableComponents]);
      localStorage.removeItem('cachedAnswers');
    });
  });

  describe('loadValueFromCachedAnswer() for refDate', () => {
    const testCachedAnswers: CachedAnswers = {
      pd1: {
        visited: true,
        disabled: false,
        value: '12.12.2020',
      },
      pd2: {
        visited: true,
        disabled: false,
        value: '15.12.2020',
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], testCachedAnswers);
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], testCachedAnswers);
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
      } as ComponentAttrsDto;

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

      const actualAttrs = service.putValueToFilters('testVal', 'Some value', attrs);

      expect(actualAttrs).toEqual(expectedAttrs);
    });

    it('should set filter in attrs', () => {
      const testCachedAnswers = ({
        pd1: { value: '{"storedValues":{"middleName": "Middle"} }' },
      } as any) as CachedAnswers;

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
      } as ComponentAttrsDto;

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

      const actualAttrs = service.setAttrsFilters(attrs, testCachedAnswers);

      expect(actualAttrs).toEqual(expectedAttrs);
    });
  });

  describe('handleRelatedRelComponents()', () => {
    const relation = {
      relatedRel: 's2',
      relation: CustomComponentRefRelation.displayOff,
      val: true,
    };
    const prepareRef = () => {
      components[0].attrs.ref = [relation];
      cachedAnswers = {
        s2: {
          visited: true,
          value: 'true',
        },
      };
    };

    it('should return components that passed in to params', () => {
      const result = service.handleRelatedRelComponents(components, cachedAnswers);
      expect(result).toEqual(components);
    });

    it('should return changed components that passed in to params', () => {
      prepareRef();
      jest.spyOn<any, string>(service, 'handleCustomComponentRef').mockReturnValue({
        id: 'a1',
        type: 'HtmlString',
        attrs: { ref: [relation], hidden: true },
      });
      const result = service.handleRelatedRelComponents(components, cachedAnswers);
      components[0].attrs.hidden = true;
      expect(result).toEqual(components);
    });

    it('should call once handleRelatedRelComponents', () => {
      prepareRef();
      const spy = jest.spyOn<any, string>(service, 'handleCustomComponentRef');
      service.handleRelatedRelComponents(components, cachedAnswers);
      expect(spy).toBeCalledTimes(1);
    });

    it("shouldn't call handleRelatedRelComponents", () => {
      const spy = jest.spyOn<any, string>(service, 'handleCustomComponentRef');
      service.handleRelatedRelComponents(components, cachedAnswers);
      expect(spy).toBeCalledTimes(0);
    });

    it('should call handleRelatedRelComponents with params', () => {
      prepareRef();
      const spy = jest.spyOn<any, string>(service, 'handleCustomComponentRef');
      service.handleRelatedRelComponents(components, cachedAnswers);
      expect(spy).toBeCalledWith(components[0], components[0].attrs.ref, components, cachedAnswers);
    });
  });

  describe('handleCustomComponentRef()', () => {
    const relation = {
      relatedRel: 's2',
      relation: CustomComponentRefRelation.displayOff,
      val: true,
    };
    const prepareRef = () => {
      components[0].attrs.ref = [relation];
      cachedAnswers = {
        s2: {
          visited: true,
          value: 'true',
        },
      };
    };

    it('should return component that passed in to params', () => {
      components[0].attrs.ref = [];
      const result = service.handleCustomComponentRef(
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers,
      );
      expect(result).toEqual(components[0]);
    });

    it('should return component with changed component with hidden', () => {
      prepareRef();
      const result = service.handleCustomComponentRef(
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers,
      );
      components[0].attrs.hidden = true;
      expect(result).toEqual(components[0]);
    });

    it('should call handleDisplayOff with params', () => {
      prepareRef();
      const spy = jest.spyOn<any, string>(service, 'handleDisplayOff');
      service.handleCustomComponentRef(
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers,
      );
      expect(spy).toBeCalledWith(
        components[0],
        components[0].attrs.ref[0] as CustomComponentRef[],
        cachedAnswers.s2.value,
      );
    });

    it("shouldn't call handleDisplayOff", () => {
      const spy = jest.spyOn<any, string>(service, 'handleDisplayOff');
      components[0].attrs.ref = [];
      service.handleCustomComponentRef(
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers,
      );
      expect(spy).not.toBeCalled();
    });

    it('should call handleDisplayOn with params', () => {
      prepareRef();
      const spy = jest.spyOn<any, string>(service, 'handleDisplayOn');
      components[0].attrs.ref[0].relation = CustomComponentRefRelation.displayOn;
      service.handleCustomComponentRef(
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers,
      );
      expect(spy).toBeCalledWith(
        components[0],
        components[0].attrs.ref[0] as CustomComponentRef[],
        cachedAnswers.s2.value,
      );
    });

    it("shouldn't call handleDisplayOn", () => {
      const spy = jest.spyOn<any, string>(service, 'handleDisplayOn');
      components[0].attrs.ref = [];
      service.handleCustomComponentRef(
        components[0],
        components[0].attrs.ref as CustomComponentRef[],
        components,
        cachedAnswers,
      );
      expect(spy).not.toBeCalled();
    });
  });

  describe('handleDisplayOff()', () => {
    const relation = {
      relatedRel: 's2',
      relation: CustomComponentRefRelation.displayOff,
      val: 'v3',
    };
    const prepareRef = () => {
      components[0].attrs.ref = [relation];
      cachedAnswers = {
        s2: {
          visited: true,
          value: 'v3',
        },
      };
    };

    it("shouldn't set hidden if value in cachedAnswers not equal", () => {
      prepareRef();
      cachedAnswers.s2.value = 'v42';
      service.handleDisplayOff(components[0], relation, cachedAnswers.s2.value);
      expect(components[0].attrs.hidden).toBeFalsy();
    });

    it('should set hidden if value in cachedAnswers is equal', () => {
      prepareRef();
      service.handleDisplayOff(components[0], relation, cachedAnswers.s2.value);
      expect(components[0].attrs.hidden).toBeTruthy();
    });
  });
});
