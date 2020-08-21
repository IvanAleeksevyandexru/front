import { TestBed } from '@angular/core/testing';

import { TerabyteService } from './terabyte.service';

describe('TerabyteService', () => {
  let service: TerabyteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerabyteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
