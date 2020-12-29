import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../core/services/config/config.service';
import { ImgPrefixerPipe } from './img-prefixer.pipe';
import { LoadService } from 'epgu-lib';
import { LoadServiceStub } from '../../../core/services/config/load-service-stub';

describe('ImgPrefixerPipe', () => {
  let pipe: ImgPrefixerPipe;
  let configService: ConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, { provide: LoadService, useClass: LoadServiceStub }],
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
