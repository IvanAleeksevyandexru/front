import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HealthService, HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CookieService } from 'ngx-cookie-service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CustomComponent, CustomScreenComponentTypes } from '../../components-list.types';
import {
  isInnValid,
  isSnilsValid,
  isSnilsOnlyChecksumValid,
  isOgrnIpValid,
  isOgrnValid,
  isCardNumberValid,
  calculateStringPredicate,
  CARD_VALIDATION_EVENT,
} from './StringInputValidations';
import {
  invalidCheckSumSnils,
  invalidInn,
  invalidOgrn,
  invalidOgrnip,
  invalidSnils,
  validCheckSumSnils,
  validInn,
  validOgrn,
  validOgrnip,
  validSnils,
} from './StringInputValidations.mock';

describe('Validations', () => {
  let healthService: HealthService;
  let cookieService: CookieService;
  let currentAnswersService: CurrentAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HealthService, useClass: HealthServiceStub },
        CookieService,
        CurrentAnswersService,
      ],
    });
  });

  beforeEach(() => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'u=123456',
    });
    healthService = TestBed.inject(HealthService);
    cookieService = TestBed.inject(CookieService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
  });

  describe('Check INN', () => {
    validInn.forEach((inn) => {
      test(`${inn} should be correct`, () => {
        expect(isInnValid(inn)).toBe(true);
      });
    });

    invalidInn.forEach((inn) => {
      test(`${inn} should be wrong`, () => {
        expect(isInnValid(inn)).toBe(false);
      });
    });
  });

  describe('Check Snils', () => {
    validSnils.forEach((snils) => {
      test(`${snils} should be correct`, () => {
        expect(isSnilsValid(snils)).toBe(true);
      });
    });

    invalidSnils.forEach((snils) => {
      test(`${snils} should be wrong`, () => {
        expect(isSnilsValid(snils)).toBe(false);
      });
    });
  });

  describe('Check SnilsOnlyChecksum', () => {
    validCheckSumSnils.forEach((snils) => {
      test(`${snils} should be correct`, () => {
        expect(isSnilsOnlyChecksumValid(snils)).toBe(true);
      });
    });

    invalidCheckSumSnils.forEach((snils) => {
      test(`${snils} should be wrong`, () => {
        expect(isSnilsOnlyChecksumValid(snils)).toBe(false);
      });
    });
  });

  describe('Check Ogrnip', () => {
    validOgrnip.forEach((Ogrnip) => {
      test(`${Ogrnip} should be correct`, () => {
        expect(isOgrnIpValid(Ogrnip)).toBe(true);
      });
    });

    invalidOgrnip.forEach((Ogrnip) => {
      test(`${Ogrnip} should be wrong`, () => {
        expect(isOgrnIpValid(Ogrnip)).toBe(false);
      });
    });
  });

  describe('Check Ogrn', () => {
    validOgrn.forEach((Ogrn) => {
      test(`${Ogrn} should be correct`, () => {
        expect(isOgrnValid(Ogrn)).toBe(true);
      });
    });

    invalidOgrn.forEach((Ogrn) => {
      test(`${Ogrn} should be wrong`, () => {
        expect(isOgrnValid(Ogrn)).toBe(false);
      });
    });
  });

  describe('checkCardNumber()', () => {
    it('should return true', () => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      expect(
        isCardNumberValid('3562990024016152', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('3562 9900 2401 6152', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('3562 99002401 6152', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('35629900 24016152', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('6291 5700 1247 5287482', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('6291 5700 1247 528438', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('6291 5700 1247 52832', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('2200 3307 9345 4721 809', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(
        isCardNumberValid('2200 3307 1335 4721 6', null, { healthService, cookieService }),
      ).toBeTruthy();
      expect(spyMeasureStart).toHaveBeenCalledWith(CARD_VALIDATION_EVENT);
      expect(spyMeasureEnd).toHaveBeenCalledWith(CARD_VALIDATION_EVENT, 0, {
        userId: '123456',
        validationStatus: true,
      });
    });

    it('should return false', () => {
      const spyMeasureStart = jest.spyOn(healthService, 'measureStart');
      const spyMeasureEnd = jest.spyOn(healthService, 'measureEnd');
      expect(
        isCardNumberValid('5439 3800 2401 6155', null, { healthService, cookieService }),
      ).toBeFalsy();
      expect(spyMeasureStart).toHaveBeenCalledWith(CARD_VALIDATION_EVENT);
      expect(spyMeasureEnd).toHaveBeenCalledWith(CARD_VALIDATION_EVENT, 0, {
        userId: '123456',
        validationStatus: false,
      });
    });
  });

  describe('calculateStringPredicate()', () => {
    const mockCalcStringComponent: CustomComponent = {
      id: 'rf2',
      type: CustomScreenComponentTypes.StringInput,
      label: 'Сумма',
      attrs: {
        dictionaryType: '',
        ref: [],
        fields: [],
        validation: [
          {
            type: 'CalculatedPredicate',
            value: '',
            ref: '',
            condition: '',
            dataType: '',
            expr: '${rf2.value} > ${rf3.value}',
            errorMsg: 'Полная стоимость путёвки должна превышать оплаченную',
          },
        ],
        value: '',
      },
    };
    it('should evaluate 10 > 12 to false', () => {
      currentAnswersService.state = {
        rf3: {
          value: 12,
        },
      };
      const customValidator = calculateStringPredicate('10', mockCalcStringComponent, {
        currentAnswersService,
      });
      expect(customValidator).toBeFalsy();
    });

    it('should evaluate 10 > 8 to true', () => {
      currentAnswersService.state = {
        rf3: {
          value: 8,
        },
      };
      const customValidator = calculateStringPredicate('10', mockCalcStringComponent, {
        currentAnswersService,
      });
      expect(customValidator).toBeTruthy();
    });

    it('should throw error on evil script', () => {
      // скрипт который должен возвращать false так как ( 10 > 12 ) но получается NaN и возвращается true
      currentAnswersService.state = {
        rf3: {
          value: 'throw new Error("Evil code"); 12',
        },
      };
      expect(() =>
        calculateStringPredicate('10', mockCalcStringComponent, { currentAnswersService }),
      ).toThrowError('Ошибка в выражении CalculatedPredicate. Component ID: rf2');
    });

    it('should throw error on evil script', () => {
      // скрипт который должен возвращать false так как ( 10 > 12 ) но получается NaN и возвращается true
      currentAnswersService.state = {
        rf3: {
          value: '12; throw new Error("Evil code")',
        },
      };
      expect(() =>
        calculateStringPredicate('10', mockCalcStringComponent, { currentAnswersService }),
      ).toThrowError('Ошибка в выражении CalculatedPredicate. Component ID: rf2');
    });
  });
});
