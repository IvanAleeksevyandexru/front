import { TestBed } from '@angular/core/testing';

import { ConstructorConfigService } from './constructor-config.service';

describe('ConstructorConfigService', () => {
  let service: ConstructorConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructorConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
