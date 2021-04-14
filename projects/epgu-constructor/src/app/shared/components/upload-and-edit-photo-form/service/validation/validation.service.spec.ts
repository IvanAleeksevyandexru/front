import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import { configureTestSuite } from 'ng-bullet';

describe('ValidationService', () => {
  let service: ValidationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ValidationService);
  });

  describe('validateImage', () => {
    it('should be return with errors', () => {
      const expectedValue = { isTypeValid: false, isSizeValid: false, isDPIValid: false };
      const invalid = service.validateImage('', [], 200, 400);
      expect(invalid).toEqual(expectedValue);
    });

    it('should be return without errors', () => {
      const expectedValue = { isTypeValid: true, isSizeValid: true, isDPIValid: true };
      const invalid = service.validateImage('file.png', ['JPEG', 'PNG', 'BMP'], 500, 600);
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
      const expectedValue = [['fileType', allowedImgTypes.join(', ')], ['size'], ['dpi']];
      const errors = service.getImageError(false, false, false, 400, 530, allowedImgTypes);
      expect(errors).toEqual(expectedValue);
    });

    it('should be return common error', () => {
      const allowedImgTypes = ['JPEG', 'PNG', 'BMP'];
      const expectedValue = [['common']];
      const errors = service.getImageError(true, true, true, 400, 530, allowedImgTypes);
      expect(errors).toEqual(expectedValue);
    });
  });
});
