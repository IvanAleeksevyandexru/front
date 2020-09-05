import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { CONFIG_TOKEN } from './config.token';


describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CONFIG_TOKEN, useValue: {}},
        ConfigService
      ]
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
