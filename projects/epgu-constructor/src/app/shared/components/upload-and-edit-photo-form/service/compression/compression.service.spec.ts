import { TestBed } from '@angular/core/testing';

import { CompressionService } from './compression.service';

describe('CompressionService', () => {
  let service: CompressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompressionService],
    });
    service = TestBed.inject(CompressionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isValidImageType', () => {
    it('should be return true', () => {
      const file = new File([], 'image', { type: 'image' });
      const isValid = service.isValidImageType(file);
      expect(isValid).toBeTruthy();
    });

    it('should be return false', () => {
      const file = new File([], 'txt', { type: 'txt' });
      const isValid = service.isValidImageType(file);
      expect(isValid).toBeFalsy();
    });
  });
});
