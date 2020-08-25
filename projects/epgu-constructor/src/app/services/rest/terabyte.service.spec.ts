import { TestBed } from '@angular/core/testing';

import { TerabyteService } from './terabyte.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ConstructorConfigService } from '../config/constructor-config.service'
import { ConstructorConfigServiceStub } from '../config/constructor-config.service.stub'

describe('TerabyteService', () => {
  let service: TerabyteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerabyteService,
        {provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub}
      ]
    });
    service = TestBed.inject(TerabyteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
