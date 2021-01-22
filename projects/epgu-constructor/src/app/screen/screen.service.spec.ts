import { TestBed } from '@angular/core/testing';
import { merge as _merge } from 'lodash';
import { ScreenService } from './screen.service';
import { CurrentAnswersService } from './current-answers.service';
import { CachedAnswersService } from '../shared/services/cached-answers/cached-answers.service';
import { ScreenContent } from './screen-content';
import { Observable } from 'rxjs';
import { ScreenStore, ScreenTypes } from './screen.types';
import { UtilsService } from '../core/services/utils/utils.service';
import { ValueLoaderService } from '../shared/services/value-loader/value-loader.service';
import { DatesToolsService } from '../core/services/dates-tools/dates-tools.service';

const makeScreenStoreSample = (): ScreenStore => ({
  orderId: '653920',
  currentScenarioId: '1',
  finishedAndCurrentScreens: ['s1'],
  cachedAnswers: {},
  currentValue: {},
  errors: {},
  applicantAnswers: {},
  display: {
    id: 's1',
    name: 'Приветствие',
    type: ScreenTypes.INFO,
    header: 'Получение заграничного паспорта',
    submitLabel: 'Продолжить',
    components: [
      {
        id: 'w1',
        type: 'InfoScr',
        label:
          '<p>Планируете зарубежную поездку? Закажите заграничный паспорт себе и своим детям без ожидания в' +
          ' очередях.</p><p>Чтобы сделать правильный выбор, <a id="findout">узнайте</a>, чем загранпаспорт' +
          ' нового образца отличается от старого образца</p><p>Для получения услуги вам нужно ответить на несколько' +
          ' вопросов, чтобы мы показали необходимые действия</p>',
        attrs: {
          clarifications: {
            findout: {
              title: '',
              text:
                '<p>Загранпаспорт нового образца еще называют содержащим электронный носитель информации ' +
                'либо биометрическим. Его особенности:</p><p>- срок действия — 10 лет;</p><p>- госпошлина' +
                ' за оформление — 5000 рублей (3500 рублей при оплате на портале) для взрослых и 2500 рублей' +
                ' (1750 рублей при оплате на портале) для детей до 14 лет;</p><p> - обязательное сканирование' +
                ' папиллярных узоров пальцев;</p><p>- фото на документ делает сотрудник МВД;</p><p>- количество' +
                ' страниц - 46;</p><p>- нельзя внести информацию о детях;</p><p>- обязательно присутствие ребенка' +
                ' при оформлении загранпаспорта на него.</p><p>Особенности загранпаспорта старого образца:- срок' +
                ' действия — 5 лет;</p><p>- госпошлина за оформление — 2000 рублей (1400 рублей при оплате на портале)' +
                ' для взрослых и 1000 рублей (700 рублей при оплате на портале) для детей до 14 лет;</p>' +
                '<p>- дактилоскопическая регистрация не нужна;</p</p><p>- можно внести информацию о детях' +
                ' до 14 лет;</p><p>- присуствие ребенка до 14 лет при оформлении загранпаспорта не обязательно.</p>',
            },
          },
          refs: {
            timeStartRef: '',
            timeFinishRef: '',
            visitTimeRef: '',
          },
        },
        value: 'component w1 value',
        required: true,
        valueFromCache: true,
      },
    ],
    terminal: false,
    firstScreen: false,
  },
});

describe('ScreenService', () => {
  let screenService: ScreenService;

  let cachedAnswersService: CachedAnswersService;
  let currentAnswersService: CurrentAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService,
        UtilsService,
        ValueLoaderService,
        DatesToolsService,
      ],
    });
    screenService = TestBed.inject(ScreenService);

    cachedAnswersService = TestBed.inject(CachedAnswersService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
  });

  it('should extend ScreenContent', () => {
    expect(screenService).toBeInstanceOf(ScreenContent);
  });

  it('isLoading$ should be Observable', () => {
    expect(screenService.isLoading$).toBeInstanceOf(Observable);
  });

  describe('initScreenStore() method', () => {
    it('should set screenStore property', () => {
      const store = makeScreenStoreSample();

      screenService.initScreenStore(store);

      expect(screenService.getStore()).toBe(store);
    });

    it('should call ScreenContent.updateScreenContent() method', () => {
      const updateScreenContentSpy = spyOn(screenService, 'updateScreenContent');

      const store = makeScreenStoreSample();

      screenService.initScreenStore(store);

      expect(updateScreenContentSpy).toBeCalledTimes(1);
      expect(updateScreenContentSpy).toBeCalledWith(store);
    });

    describe('loadValueFromCachedAnswer', () => {
      describe('condition: hasPresetTypeRef && shouldBeTakenFromTheCache && !cachedValue', () => {
        it('should get preset value from cache', () => {
          const originalStore = _merge(makeScreenStoreSample(), {
            cachedAnswers: {
              p1: {
                visited: true,
                value: JSON.stringify({ a: { b: { c: 3 }}}),
              },
            },
            display: {
              components: [
                {
                  attrs: {
                    preset: {
                      type: 'REF',
                      value: 'p1.a.b.c',
                    },
                  },
                  valueFromCache: false,
                },
              ],
            },
          });

          const expectedStore = _merge({}, originalStore, {
            display: {
              components: [
                {
                  value: 3,
                },
              ],
            },
          });

          screenService.initScreenStore(originalStore);

          expect(originalStore).toEqual(expectedStore);
        });
      });

      describe('condition: NOT(hasPresetTypeRef && shouldBeTakenFromTheCache && !cachedValue)', () => {
        it('should set component.presetValue to component.value', () => {
          const originalStore = makeScreenStoreSample();

          const expectedStore = _merge({}, originalStore, {
            display: {
              components: [
                {
                  presetValue: 'component w1 value',
                  valueFromCache: false,
                },
              ],
            },
          });

          screenService.initScreenStore(originalStore);

          expect(originalStore).toEqual(expectedStore);
        });

        it('should merge preset cached value if there is a cached answer', () => {
          const originalStore = {
            ...makeScreenStoreSample(),
            cachedAnswers: {
              w1: {
                visited: true,
                value: 'cached answer w1 value',
              },
            },
          };

          const expectedStore = _merge({}, originalStore, {
            display: {
              components: [
                {
                  value: 'cached answer w1 value',
                  presetValue: 'component w1 value',
                },
              ],
            },
          });

          screenService.initScreenStore(originalStore);

          expect(originalStore).toEqual(expectedStore);
        });
      });
    });

    it('should init component state service', () => {
      expect(currentAnswersService.state).toBeUndefined();
      expect(currentAnswersService.isValid).toBeNull();

      screenService.initScreenStore(makeScreenStoreSample());

      expect(currentAnswersService.state).toBe('');
      expect(currentAnswersService.isValid).toBeTruthy();
    });
  });

  describe('updateScreenStore() method', () => {
    it('should update store', () => {
      const store = makeScreenStoreSample();

      screenService.initScreenStore(store);

      const mergeWithState = {
        cachedAnswers: {
          mm: {
            visited: true,
            value: '',
          },
        },
      };

      const expectedStore = {
        ...store,
        ...mergeWithState,
      };

      screenService.updateScreenStore(mergeWithState);

      expect(screenService.getStore()).toEqual(expectedStore);
    });

    it('should call ScreenContent.updateScreenContent() method', () => {
      const store = makeScreenStoreSample();

      screenService.initScreenStore(store);

      const mergeWithState = {
        cachedAnswers: {
          mm: {
            visited: true,
            value: '',
          },
        },
      };

      const updateScreenContentSpy = spyOn(screenService, 'updateScreenContent');

      screenService.updateScreenStore(mergeWithState);

      expect(updateScreenContentSpy).toBeCalledTimes(1);
      expect(updateScreenContentSpy).toBeCalledWith(mergeWithState);
    });
  });

  describe('updateLoading() method', () => {
    it('should emit isLoading$ observable', (done) => {
      screenService.updateLoading(true);

      screenService.isLoading$.subscribe((isLoading) => {
        expect(isLoading).toBeTruthy();
        done();
      });
    });
  });

  describe('getStore() method', () => {
    it('should get screenStore property', () => {
      const store = makeScreenStoreSample();

      screenService.initScreenStore(store);

      expect(screenService.getStore()).toBe(store);
    });
  });

  describe('getCompFromDisplay() method', () => {
    it('should get component', () => {
      const store = makeScreenStoreSample();

      screenService.initScreenStore(store);

      expect(screenService.getCompFromDisplay('w1')).toBe(store.display.components[0]);
    });
  });

  describe('getCompValueFromCachedAnswers() method', () => {
    it('should get component by component id from parameters', () => {
      const store = {
        ...makeScreenStoreSample(),
        cachedAnswers: {
          w1: {
            visited: true,
            value: 'cached answer w1 value',
          },
        },
      };

      screenService.initScreenStore(store);

      expect(screenService.getCompValueFromCachedAnswers('w1')).toBe('cached answer w1 value');
    });

    it('should get component by component id from instance property', () => {
      const store = {
        ...makeScreenStoreSample(),
        cachedAnswers: {
          w1: {
            visited: true,
            value: 'cached answer w1 value',
          },
        },
      };

      screenService.initScreenStore(store);

      expect(screenService.getCompValueFromCachedAnswers()).toBe('cached answer w1 value');
    });
  });
});
