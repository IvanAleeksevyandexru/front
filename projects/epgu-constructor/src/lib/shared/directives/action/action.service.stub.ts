import { Injectable } from '@angular/core';
import { ComponentActionDto } from '@epgu/epgu-constructor-types';

@Injectable()
export class ActionServiceStub {
  action: ComponentActionDto;
  componentId: string;

  navigate(stepType: string): void {}

  navigateModal(stepType: string): void {}

  switchAction(): void {}
}
