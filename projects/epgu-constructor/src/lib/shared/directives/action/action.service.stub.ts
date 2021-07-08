import { Injectable } from '@angular/core';
import { ActionApiResponse, ComponentActionDto, EaisdoResponse } from '@epgu/epgu-constructor-types';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable()
export class ActionServiceStub {
  action: ComponentActionDto;
  componentId: string;

  navigate(stepType: string): void {}

  navigateModal(stepType: string): void {}

  switchAction(): void {}

  public handleExternalIntegrationAction(): Observable<ActionApiResponse<EaisdoResponse>> {
    return of();
  }
}
