import { Injectable } from '@angular/core';
import { ScreenStoreComponentDtoI } from '../../../screen/screen.types';

@Injectable()
export class PrepareComponentsServiceStub {
  public prepareComponents(): ScreenStoreComponentDtoI[] {
    return [];
  }
}
