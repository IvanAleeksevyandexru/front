import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../config/config.service';
import { ImgPrefixerPipe } from './img-prefixer.pipe';
import { LoadService } from 'epgu-lib';
import { LoadServiceStub } from '../../../config/load-service-stub';

describe('ImgPrefixerPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: LoadService, useClass: LoadServiceStub }
      ]
    });
  });

  it('create an instance', () => {
    const configService: ConfigService = TestBed.get(ConfigService);
    const pipe = new ImgPrefixerPipe(configService);
    expect(pipe).toBeTruthy();
  });
});
