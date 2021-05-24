import { ScreenContent } from './screen-content';
import { ScreenStore, ScreenTypes } from './screen.types';
import {
  ComponentActionDto,
  DTOActionAction,
  DisplaySubjHead,
  DisplayDto,
  ComponentDto,
  ApplicantAnswersDto,
  Gender,
} from 'epgu-constructor-types';


const screenStoreSample: ScreenStore = {
  orderId: 653920,
  currentScenarioId: 1,
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
          actions: [
            {
              label: 'actionLabel1',
              value: 'actionValue1',
              action: DTOActionAction.editPhoneNumber,
            },
          ],
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
      },
    ],
    terminal: false,
    firstScreen: false,
  },
};

const displaySubjHeadSample: DisplaySubjHead = {
  text: 'any',
  clarifications: {},
};

const displayDtoSample: DisplayDto = {
  components: [],
  header: '',
  id: '',
  name: '',
  submitLabel: '',
  type: ScreenTypes.INFO,
  terminal: true,
};

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const componentActionDtoSample1: ComponentActionDto = {
  label: 'actionLabel1',
  value: 'actionValue1',
  action: DTOActionAction.editPhoneNumber,
};

const applicantAnswersDtoSample: ApplicantAnswersDto = {
  foo: {
    visited: true,
    value: 'bar',
  },
};

describe('ScreenContent', () => {
  let screenContent: ScreenContent;

  beforeEach(() => {
    screenContent = new ScreenContent();
  });

  describe('display property', () => {
    const dataSample = displayDtoSample;

    it('should get and set value', () => {
      expect(screenContent.display).toBeNull();

      screenContent.display = dataSample;

      expect(screenContent.display).toBe(dataSample);
    });

    it('set value should emit display$ Observable', (done) => {
      screenContent.display = dataSample;

      screenContent.display$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('header property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.header).toBeNull();

      screenContent.header = dataSample;

      expect(screenContent.header).toBe(dataSample);
    });

    it('set value should emit header$ Observable', (done) => {
      screenContent.header = dataSample;

      screenContent.header$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('subHeader property', () => {
    const dataSample = displaySubjHeadSample;

    it('should get and set value', () => {
      expect(screenContent.subHeader).toBeNull();

      screenContent.subHeader = dataSample;

      expect(screenContent.subHeader).toBe(dataSample);
    });

    it('set value should emit subHeader$ Observable', (done) => {
      screenContent.subHeader = dataSample;

      screenContent.subHeader$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('submitLabel property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.submitLabel).toBeNull();

      screenContent.submitLabel = dataSample;

      expect(screenContent.submitLabel).toBe(dataSample);
    });

    it('set value should emit submitLabel$ Observable', (done) => {
      screenContent.submitLabel = dataSample;

      screenContent.submitLabel$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('gender property', () => {
    const dataSample = Gender.male;

    it('should get and set value', () => {
      expect(screenContent.gender).toBeNull();

      screenContent.gender = dataSample;

      expect(screenContent.gender).toBe(dataSample);
    });

    it('set value should emit gender$ Observable', (done) => {
      screenContent.gender = dataSample;

      screenContent.gender$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('terminal property', () => {
    const dataSample = true;

    it('should get and set value', () => {
      expect(screenContent.terminal).toBeNull();

      screenContent.terminal = dataSample;

      expect(screenContent.terminal).toBe(dataSample);
    });

    it('set value should emit terminal$ Observable', (done) => {
      screenContent.terminal = dataSample;

      screenContent.terminal$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('showNav property', () => {
    const dataSample = true;

    it('should get and set value', () => {
      expect(screenContent.showNav).toBeNull();

      screenContent.showNav = dataSample;

      expect(screenContent.showNav).toBe(dataSample);
    });

    it('set value should emit showNav$ Observable', (done) => {
      screenContent.showNav = dataSample;

      screenContent.showNav$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('displayCssClass property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.displayCssClass).toBeNull();

      screenContent.displayCssClass = dataSample;

      expect(screenContent.displayCssClass).toBe(dataSample);
    });

    it('set value should emit displayCssClass$ Observable', (done) => {
      screenContent.displayCssClass = dataSample;

      screenContent.displayCssClass$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('screenType property', () => {
    const dataSample = ScreenTypes.CUSTOM;

    it('should get and set value', () => {
      expect(screenContent.screenType).toBeNull();

      screenContent.screenType = dataSample;

      expect(screenContent.screenType).toBe(dataSample);
    });

    it('set value should emit screenType$ Observable', (done) => {
      screenContent.screenType = dataSample;

      screenContent.screenType$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('orderId property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.orderId).toBeNull();

      screenContent.orderId = dataSample;

      expect(screenContent.orderId).toBe(dataSample);
    });

    it('set value should emit orderId$ Observable', (done) => {
      screenContent.orderId = dataSample;

      screenContent.orderId$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('component property', () => {
    const dataSample = componentDtoSample;

    it('should get and set value', () => {
      expect(screenContent.component).toBeNull();

      screenContent.component = dataSample;

      expect(screenContent.component).toBe(dataSample);
    });

    it('set value should emit component$ Observable', (done) => {
      screenContent.component = dataSample;

      screenContent.component$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('componentType property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.componentType).toBeNull();

      screenContent.componentType = dataSample;

      expect(screenContent.componentType).toBe(dataSample);
    });

    it('set value should emit componentType$ Observable', (done) => {
      screenContent.componentType = dataSample;

      screenContent.componentType$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('componentValue property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.componentValue).toBeNull();

      screenContent.componentValue = dataSample;

      expect(screenContent.componentValue).toBe(dataSample);
    });

    it('set value should emit componentValue$ Observable', (done) => {
      screenContent.componentValue = dataSample;

      screenContent.componentValue$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('componentErrors property', () => {
    const dataSample = { a: 'b' };

    it('should get and set value', () => {
      expect(screenContent.componentErrors).toBeNull();

      screenContent.componentErrors = dataSample;

      expect(screenContent.componentErrors).toBe(dataSample);
    });

    it('set value should emit componentErrors$ Observable', (done) => {
      screenContent.componentErrors = dataSample;

      screenContent.componentErrors$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('componentLabel property', () => {
    const dataSample = 'any';

    it('should get and set value', () => {
      expect(screenContent.componentLabel).toBeNull();

      screenContent.componentLabel = dataSample;

      expect(screenContent.componentLabel).toBe(dataSample);
    });

    it('set value should emit componentLabel$ Observable', (done) => {
      screenContent.componentLabel = dataSample;

      screenContent.componentLabel$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('actions property', () => {
    const dataSample = [componentActionDtoSample1];

    it('should get and set value', () => {
      expect(screenContent.actions).toBeNull();

      screenContent.actions = dataSample;

      expect(screenContent.actions).toBe(dataSample);
    });

    it('set value should emit actions$ Observable', (done) => {
      screenContent.actions = dataSample;

      screenContent.actions$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('action property', () => {
    const dataSample = componentActionDtoSample1;

    it('should get and set value', () => {
      expect(screenContent.action).toBeNull();

      screenContent.action = dataSample;

      expect(screenContent.action).toBe(dataSample);
    });

    it('set value should emit action$ Observable', (done) => {
      screenContent.action = dataSample;

      screenContent.action$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('applicantAnswers property', () => {
    const dataSample = applicantAnswersDtoSample;

    it('should get and set value', () => {
      expect(screenContent.applicantAnswers).toBeNull();

      screenContent.applicantAnswers = dataSample;

      expect(screenContent.applicantAnswers).toBe(dataSample);
    });

    it('set value should emit applicantAnswers$ Observable', (done) => {
      screenContent.applicantAnswers = dataSample;

      screenContent.applicantAnswers$.subscribe((value) => {
        expect(value).toBe(dataSample);
        done();
      });
    });
  });

  describe('updateScreenContent() method', () => {
    it('should set all service properties from screenStore argument', () => {
      const displaySpy = jest.spyOn(screenContent, 'display', 'set');
      const headerSpy = jest.spyOn(screenContent, 'header', 'set');
      const subHeaderSpy = jest.spyOn(screenContent, 'subHeader', 'set');
      const submitLabelSpy = jest.spyOn(screenContent, 'submitLabel', 'set');
      const genderSpy = jest.spyOn(screenContent, 'gender', 'set');
      const terminalSpy = jest.spyOn(screenContent, 'terminal', 'set');
      const showNavSpy = jest.spyOn(screenContent, 'showNav', 'set');
      const displayCssClassSpy = jest.spyOn(screenContent, 'displayCssClass', 'set');
      const screenTypeSpy = jest.spyOn(screenContent, 'screenType', 'set');
      const orderIdSpy = jest.spyOn(screenContent, 'orderId', 'set');
      const componentSpy = jest.spyOn(screenContent, 'component', 'set');
      const componentTypeSpy = jest.spyOn(screenContent, 'componentType', 'set');
      const componentValueSpy = jest.spyOn(screenContent, 'componentValue', 'set');
      const componentErrorsSpy = jest.spyOn(screenContent, 'componentErrors', 'set');
      const componentLabelSpy = jest.spyOn(screenContent, 'componentLabel', 'set');
      const actionsSpy = jest.spyOn(screenContent, 'actions', 'set');
      const actionSpy = jest.spyOn(screenContent, 'action', 'set');
      const applicantAnswersSpy = jest.spyOn(screenContent, 'applicantAnswers', 'set');

      screenContent.updateScreenContent(screenStoreSample);

      expect(displaySpy).toBeCalledTimes(1);
      expect(displaySpy).toBeCalledWith(screenStoreSample.display);

      expect(headerSpy).toBeCalledTimes(1);
      expect(headerSpy).toBeCalledWith(screenStoreSample.display.header);

      expect(subHeaderSpy).toBeCalledTimes(1);
      expect(subHeaderSpy).toBeCalledWith(screenStoreSample.display.subHeader);

      expect(submitLabelSpy).toBeCalledTimes(1);
      expect(submitLabelSpy).toBeCalledWith(screenStoreSample.display.submitLabel);

      expect(genderSpy).toBeCalledTimes(1);
      expect(genderSpy).toBeCalledWith(screenStoreSample.gender);

      expect(terminalSpy).toBeCalledTimes(1);
      expect(terminalSpy).toBeCalledWith(screenStoreSample.display.terminal);

      expect(showNavSpy).toBeCalledTimes(1);
      expect(showNavSpy).toBeCalledWith(!screenStoreSample.display.terminal);

      expect(displayCssClassSpy).toBeCalledTimes(1);
      expect(displayCssClassSpy).toBeCalledWith(screenStoreSample.display.cssClass);

      expect(screenTypeSpy).toBeCalledTimes(1);
      expect(screenTypeSpy).toBeCalledWith(screenStoreSample.display.type);

      expect(orderIdSpy).toBeCalledTimes(1);
      expect(orderIdSpy).toBeCalledWith(screenStoreSample.orderId);

      expect(componentSpy).toBeCalledTimes(1);
      expect(componentSpy).toBeCalledWith(screenStoreSample.display.components[0]);

      expect(componentTypeSpy).toBeCalledTimes(1);
      expect(componentTypeSpy).toBeCalledWith(screenStoreSample.display.components[0].type);

      expect(componentValueSpy).toBeCalledTimes(1);
      expect(componentValueSpy).toBeCalledWith(screenStoreSample.display.components[0].value);

      expect(componentErrorsSpy).toBeCalledTimes(1);
      expect(componentErrorsSpy).toBeCalledWith(screenStoreSample.errors);

      expect(componentLabelSpy).toBeCalledTimes(1);
      expect(componentLabelSpy).toBeCalledWith(screenStoreSample.display.components[0].label);

      expect(actionsSpy).toBeCalledTimes(1);
      expect(actionsSpy).toBeCalledWith(screenStoreSample.display.components[0].attrs.actions);

      expect(actionSpy).toBeCalledTimes(1);
      expect(actionSpy).toBeCalledWith(screenStoreSample.display.components[0].attrs.actions[0]);

      expect(applicantAnswersSpy).toBeCalledTimes(1);
      expect(applicantAnswersSpy).toBeCalledWith(screenStoreSample.applicantAnswers);
    });
  });

  describe('getComponentData() method', () => {
    it('should return parsed JSON if argument is valid JSON', () => {
      const expectedObject = {
        a: {
          b: 'c',
        },
      };

      expect(screenContent.getComponentData(JSON.stringify(expectedObject))).toEqual(
        expectedObject,
      );
    });

    it('should return raw argument if argument is NOT a valid JSON', () => {
      const notValidJson = 'not valid JSON';

      expect(screenContent.getComponentData(notValidJson)).toBe(notValidJson);
    });
  });
});
