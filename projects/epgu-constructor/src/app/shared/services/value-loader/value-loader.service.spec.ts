import { TestBed } from '@angular/core/testing';

import { ValueLoaderService } from './value-loader.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';

describe('ValueLoaderService', () => {
  let service: ValueLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CachedAnswersService,
        UtilsService,
        ValueLoaderService,
        DatesToolsService,
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ValueLoaderService);
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
      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], cachedAnswers);
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], cachedAnswers);
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], cachedAnswers);
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], cachedAnswers);
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

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([component]);
    });
  });

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
