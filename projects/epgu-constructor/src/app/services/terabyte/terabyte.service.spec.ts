import { TestBed } from '@angular/core/testing';

import { TerabyteService } from './terabyte.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { ConfigServiceStub } from '../../config/config.service.stub';

describe('TerabyteService', () => {
  let service: TerabyteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerabyteService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(TerabyteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
