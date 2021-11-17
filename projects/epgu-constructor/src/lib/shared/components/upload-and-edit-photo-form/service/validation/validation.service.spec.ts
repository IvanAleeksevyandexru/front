import { TestBed } from '@angular/core/testing';
import { ComponentValidationDto } from '@epgu/epgu-constructor-types';

import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  const validations = [
    {
      value: '[w.]',
      errorMsg: 'Недопустимое имя файла',
    },
  ] as ComponentValidationDto[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ValidationService);
  });

  describe('validateImage', () => {
    it('should be return with errors', () => {
      const expectedValue = {
        isTypeValid: false,
        isSizeValid: false,
        isDPIValid: false,
        fileNameErrorMsg: 'Недопустимое имя файла',
      };
      const invalid = service.validateImage('', [], 200, 400, validations);
      expect(invalid).toEqual(expectedValue);
    });

    it('should be return without errors', () => {
      const expectedValue = {
        isTypeValid: true,
        isSizeValid: true,
        isDPIValid: true,
        fileNameErrorMsg: null,
      };
      const invalid = service.validateImage(
        'file.png',
        ['JPEG', 'PNG', 'BMP'],
        500,
        600,
        validations,
      );
      expect(invalid).toEqual(expectedValue);
    });
  });

  describe('isDPIValid', () => {
    it('should be return true', () => {
      expect(service.isDPIValid(600)).toBeTruthy();
    });

    it('should be return false', () => {
      expect(service.isDPIValid(200)).toBeFalsy();
    });
  });

  describe('isTypeValid', () => {
    it('should be return true', () => {
      const valid = service.isTypeValid(['JPEG', 'JPG', 'PNG', 'BMP'], 'JPG');
      expect(valid).toBeTruthy();
    });

    it('should be return false', () => {
      const invalid = service.isTypeValid(['JPEG', 'PNG', 'BMP'], 'JPG');
      expect(invalid).toBeFalsy();
    });
  });

  describe('isSizeValid', () => {
    it('should be return true', () => {
      const valid = service.isSizeValid(450, 600);
      expect(valid).toBeTruthy();
    });

    it('should be return false', () => {
      const invalid = service.isSizeValid(400, 530);
      expect(invalid).toBeFalsy();
    });
  });

  describe('getImageError', () => {
    it('should be return all errors', () => {
      const allowedImgTypes = ['JPEG', 'PNG', 'BMP'];
      const expectedValue = [
        ['fileType', allowedImgTypes.join(', ')],
        ['size'],
        ['dpi'],
        ['fileName', 'Недопустимое имя файла'],
      ];
      const errors = service.getImageError(
        false,
        false,
        false,
        400,
        530,
        'Недопустимое имя файла',
        allowedImgTypes,
      );
      expect(errors).toEqual(expectedValue);
    });

    it('should be return common error', () => {
      const allowedImgTypes = ['JPEG', 'PNG', 'BMP'];
      const expectedValue = [['common']];
      const errors = service.getImageError(true, true, true, 400, 530, null, allowedImgTypes);
      expect(errors).toEqual(expectedValue);
    });
  });

  describe('validateFileName', () => {
    it('should be return error', () => {
      const invalid = service.validateFileName('', validations);
      expect(invalid).toBe('Недопустимое имя файла');
    });

    it('should be return null', () => {
      const valid = service.validateFileName('file.png', validations);
      expect(valid).toBeNull();
    });
  });
});
