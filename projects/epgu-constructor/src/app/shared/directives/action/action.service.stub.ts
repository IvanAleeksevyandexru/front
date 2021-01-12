import { Injectable } from '@angular/core';
import { ComponentActionDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class ActionServiceStub {
  action: ComponentActionDto;
  componentId: string;

  navigate(stepType: string): void {
  }

  navigateModal(stepType: string): void {
  }

  switchAction(): void {
  }
}
