import { Injectable } from '@angular/core';
import { SCREEN_COMPONENTS } from './screen.const';


@Injectable()
export class ScreenService {
  getScreenComponentByType(screenType: string) {
    return SCREEN_COMPONENTS[screenType];
  }
}
