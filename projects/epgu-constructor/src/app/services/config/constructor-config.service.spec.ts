import { TestBed } from '@angular/core/testing';

import { ConstructorConfigService } from './constructor-config.service';
import { CONSTRUCTOR_CONFIG_TOKEN } from './constructor.config.token';


describe('ConstructorConfigService', () => {
  let service: ConstructorConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CONSTRUCTOR_CONFIG_TOKEN, useValue: {} },
        ConstructorConfigService
      ]
    });
    service = TestBed.inject(ConstructorConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
