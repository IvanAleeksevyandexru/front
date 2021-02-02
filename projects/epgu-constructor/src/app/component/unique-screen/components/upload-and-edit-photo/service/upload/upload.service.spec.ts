import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UploadService } from './upload.service';
import { TerraByteApiService } from '../../../../services/terra-byte-api/terra-byte-api.service';
import { CompressionService } from '../compression/compression.service';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UploadService,
        TerraByteApiService,
        CompressionService,
        UtilsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
    service = TestBed.inject(UploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
