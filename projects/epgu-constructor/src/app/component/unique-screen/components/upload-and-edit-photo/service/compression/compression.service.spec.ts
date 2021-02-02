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
});
