import { TestBed } from '@angular/core/testing';

import { CarDetailInfoService } from './car-detail-info.service';

describe('CarDetailInfoService', () => {
  let service: CarDetailInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarDetailInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
