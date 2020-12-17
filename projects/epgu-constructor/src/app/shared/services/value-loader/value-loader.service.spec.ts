import { TestBed } from '@angular/core/testing';

import { ValueLoaderService } from './value-loader.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';

describe('ValueLoaderService', () => {
  let service: ValueLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachedAnswersService, UtilsService, ValueLoaderService],
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
            },
          ],
        },
        value: '',
        required: true,
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
            },
          ],
        },
        value: '',
        required: true,
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
            },
          ],
        },
        value: '',
        required: true,
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
          },
        ],
      ];

      const componentDtoIS = service.loadValueFromCachedAnswer([componentMock], cachedAnswers);
      expect(componentDtoIS).toEqual([repeatableComponents]);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
