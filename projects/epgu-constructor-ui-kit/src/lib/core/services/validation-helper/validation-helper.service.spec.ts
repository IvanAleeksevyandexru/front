import { TestBed } from '@angular/core/testing';
import { ValidationHelperService } from './validation-helper.service';
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
} from './validation.mock';

describe('ValidationHelperService', () => {
  let service: ValidationHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationHelperService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ValidationHelperService);
  });

  describe('Check INN', () => {
    validInn.forEach((inn) => {
      test(`${inn} should be correct`, () => {
        expect(service.checkINN(inn)).toBe(true);
      });
    });

    invalidInn.forEach((inn) => {
      test(`${inn} should be wrong`, () => {
        expect(service.checkINN(inn)).toBe(false);
      });
    });
  });

  describe('Check Snils', () => {
    validSnils.forEach((snils) => {
      test(`${snils} should be correct`, () => {
        expect(service.checkSnils(snils)).toBe(true);
      });
    });

    invalidSnils.forEach((snils) => {
      test(`${snils} should be wrong`, () => {
        expect(service.checkSnils(snils)).toBe(false);
      });
    });
  });

  describe('Check SnilsOnlyChecksum', () => {
    validCheckSumSnils.forEach((snils) => {
      test(`${snils} should be correct`, () => {
        expect(service.checkSnilsOnlyChecksum(snils)).toBe(true);
      });
    });

    invalidCheckSumSnils.forEach((snils) => {
      test(`${snils} should be wrong`, () => {
        expect(service.checkSnilsOnlyChecksum(snils)).toBe(false);
      });
    });
  });

  describe('Check Ogrnip', () => {
    validOgrnip.forEach((Ogrnip) => {
      test(`${Ogrnip} should be correct`, () => {
        expect(service.checkOgrnip(Ogrnip)).toBe(true);
      });
    });

    invalidOgrnip.forEach((Ogrnip) => {
      test(`${Ogrnip} should be wrong`, () => {
        expect(service.checkOgrnip(Ogrnip)).toBe(false);
      });
    });
  });

  describe('Check Ogrn', () => {
    validOgrn.forEach((Ogrn) => {
      test(`${Ogrn} should be correct`, () => {
        expect(service.checkOgrn(Ogrn)).toBe(true);
      });
    });

    invalidOgrn.forEach((Ogrn) => {
      test(`${Ogrn} should be wrong`, () => {
        expect(service.checkOgrn(Ogrn)).toBe(false);
      });
    });
  });
});
