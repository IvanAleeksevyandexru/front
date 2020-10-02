import { inject } from '@angular/core/testing';
import { ConfigService } from '../../../config/config.service';
import { ImgPrefixerPipe } from './img-prefixer.pipe';

describe('ImgPrefixerPipe', () => {
  it('create an instance', inject([ConfigService], (configService: ConfigService) => {
    const pipe = new ImgPrefixerPipe(configService);
    expect(pipe).toBeTruthy();
  }));
});
