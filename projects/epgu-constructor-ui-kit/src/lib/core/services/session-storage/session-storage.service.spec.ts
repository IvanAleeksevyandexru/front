import { TestBed } from '@angular/core/testing';
import { SessionStorageService } from './session-storage.service';
import { configureTestSuite } from 'ng-bullet';

const TEST_KEY = 'TEST_KEY';

describe('SessionStorageService', () => {
  let service: SessionStorageService;
  const mockObject = {
    someKey: 'someValue',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [SessionStorageService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SessionStorageService);
  });

  afterEach(() => {
    sessionStorage.removeItem(TEST_KEY);
  });

  describe('getObject()', () => {
    it('should return object by key', () => {
      const item = JSON.stringify(mockObject);
      sessionStorage.setItem(TEST_KEY, item);
      const result = service.get(TEST_KEY);
      expect(result).toEqual(mockObject);
    });

    it('should throw error when get not object', () => {
      const item = 'I\'m going to blow';
      sessionStorage.setItem(TEST_KEY, item);
      expect(() => service.get(TEST_KEY)).toThrow('Unexpected token I in JSON at position');
    });
  });

  describe('getRaw()', () => {
    it('should return rawValue by key', () => {
      const item = 'someValue';
      sessionStorage.setItem(TEST_KEY, item);
      const result = service.getRaw(TEST_KEY);
      expect(result).toEqual(item);
    });
  });

  describe('set()', () => {
    it('should set object by key', () => {
      const rawItem = JSON.stringify(mockObject);
      service.set(TEST_KEY, mockObject);
      expect(sessionStorage.getItem(TEST_KEY)).toEqual(rawItem);
    });
  });

  describe('setRaw()', () => {
    it('should set raw string by key', () => {
      const rawItem = 'someValue';
      service.setRaw(TEST_KEY, rawItem);
      expect(sessionStorage.getItem(TEST_KEY)).toEqual(rawItem);
    });
  });

  describe('delete()', () => {
    it('should delete item by key', () => {
      const rawItem = 'someValue';
      service.setRaw(TEST_KEY, rawItem);
      service.delete(TEST_KEY);
      const result = service.getRaw(TEST_KEY);
      expect(result).toBeNull();
    });
  });
});
