import { TestBed } from '@angular/core/testing';

import { UtilsService } from '../utils/utils.service';

describe('WebcamService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
