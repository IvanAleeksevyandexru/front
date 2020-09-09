import { Injectable } from '@angular/core';
import { SCREEN_COMPONENTS } from '../../screen/screen.const';


@Injectable()
export class ScreenResolverService {
  getScreenComponentByType(screenType: string) {
    return SCREEN_COMPONENTS[screenType];
  }
}
