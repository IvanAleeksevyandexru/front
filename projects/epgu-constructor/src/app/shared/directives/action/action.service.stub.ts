import { Injectable } from '@angular/core';
import { ComponentActionDto } from 'epgu-constructor-types/dist/base/component-action-dto';

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
