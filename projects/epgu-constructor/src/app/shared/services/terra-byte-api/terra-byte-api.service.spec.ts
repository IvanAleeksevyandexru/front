import { TestBed } from '@angular/core/testing';

import { TerraByteApiService } from './terra-byte-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { ConfigServiceStub } from '../../config/config.service.stub';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';

describe('TerraByteApiService', () => {
  let service: TerraByteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerraByteApiService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(TerraByteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
