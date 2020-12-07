import { Injectable } from '@angular/core';
import { NavigationPayload } from '../../../form-player/form-player.types';
import { ScreenService } from '../../screen.service';
import { ScreenStore } from '../../screen.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { CurrentCycledFieldsDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class CycledFieldsServiceStub {

  constructor() { }

  initCycledFields(): void {
  }

  dataTransform(): NavigationPayload {
    return {};
  }
}
