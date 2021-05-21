import { TestBed } from '@angular/core/testing';
import { LoadService } from 'epgu-lib';
import { ConfigService } from '../../../core/services/config/config.service';
import { LoadServiceStub } from '../../../core/services/config/load-service-stub';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../core/services/logger/logger.service.stub';
import { ImgPrefixerPipe } from './img-prefixer.pipe';

describe('ImgPrefixerPipe', () => {
  let pipe: ImgPrefixerPipe;
  let configService: ConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: LoadService, useClass: LoadServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    });

    configService = TestBed.get(ConfigService);
    pipe = new ImgPrefixerPipe(configService);
  });

  it('check inject link', () => {
    configService['_staticDomainAssetsPath'] = 'test';
    expect(pipe.transform('src=\'{staticDomainAssetsPath}\'')).toBe('src=\'test\'');
    expect(pipe.transform('src="{staticDomainAssetsPath}"')).toBe('src="test"');
    expect(pipe.transform('src="{staticDomainAssetsPath}/123"')).toBe('src="test/123"');
  });
});
