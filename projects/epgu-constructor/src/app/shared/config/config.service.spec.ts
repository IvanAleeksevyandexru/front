import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { LoadService } from 'epgu-lib';
import { LoadServiceStub } from './load-service-stub';


describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: LoadService, useClass: LoadServiceStub }
      ]
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
