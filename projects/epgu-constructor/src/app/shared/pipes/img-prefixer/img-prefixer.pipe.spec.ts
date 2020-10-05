import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../config/config.service';
import { ImgPrefixerPipe } from './img-prefixer.pipe';

describe('ImgPrefixerPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ConfigService ]
    });
  });

  it('create an instance', () => {
    const configService: ConfigService = TestBed.get(ConfigService);
    const pipe = new ImgPrefixerPipe(configService);
    expect(pipe).toBeTruthy();
  });
});
