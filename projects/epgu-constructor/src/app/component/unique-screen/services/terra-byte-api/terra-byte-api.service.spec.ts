import { TestBed } from '@angular/core/testing';

import { TerraByteApiService } from './terra-byte-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../core/config/config.service.stub';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';

describe('TerraByteApiService', () => {
  let service: TerraByteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerraByteApiService,
        UnsubscribeService,
        DeviceDetectorService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(TerraByteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
