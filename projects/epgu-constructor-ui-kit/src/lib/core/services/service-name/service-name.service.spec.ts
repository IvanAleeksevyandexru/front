import { TestBed } from '@angular/core/testing';

import { ServiceNameService } from './service-name.service';
import { configureTestSuite } from 'ng-bullet';
import { ObjectHelperService } from '../object-helper/object-helper.service';

describe('ServiceNameService', () => {
  let service: ServiceNameService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceNameService,
        ObjectHelperService,
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ServiceNameService);
  });

  describe('getSplittedUrl()', () => {
    it('should return splitted url', () => {
      const splittedUrl = service.getSplittedUrl('test.com/test?queryParam=queryParam');

      expect(splittedUrl[0]).toBe('test.com');
      expect(splittedUrl[1]).toBe('test');
      expect(splittedUrl[2]).toBe(undefined);
    });
  });

  describe('getServiceName()', () => {
    it('should return service name', () => {
      expect(service.getServiceName('https://www.gosuslugi.ru/600101/1/form-item')).toBe('FormItemService');
    });

    it('shouldn\'t return service name if path is incorrect ', () => {
      expect(service.getServiceName('https://www.gosuslugi.ru/600101/form')).not.toBe('FormService');
    });

  });

  describe('isValidHttpUrl()', () => {
    it('should return true', () => {
      expect(service.isValidHttpUrl('url')).toBe(true);
    });

    it('should return false', () => {
      expect(service.isValidHttpUrl(undefined)).not.toBe(false);
    });
  });
});
