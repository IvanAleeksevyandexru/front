import { TestBed } from '@angular/core/testing';

import { ValueLoaderService } from './value-loader.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';

describe('ValueLoaderService', () => {
  let service: ValueLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachedAnswersService, UtilsService, ValueLoaderService, DatesToolsService],
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
        id: 'ai4',
        type: '',
        label: '',
        attrs: {
          components: [
            {
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
                    }
                  }
                }
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

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
