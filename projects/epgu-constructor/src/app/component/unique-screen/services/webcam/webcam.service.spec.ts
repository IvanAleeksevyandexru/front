import { TestBed } from '@angular/core/testing';

import { UtilsService } from '../../../../core/services/utils/utils.service';

describe('WebcamService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService],
    });
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
