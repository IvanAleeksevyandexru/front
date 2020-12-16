import { TestBed } from '@angular/core/testing';

import { ValueLoaderService } from './value-loader.service';

describe('ValueLoaderService', () => {
  let service: ValueLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValueLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
