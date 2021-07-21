import { Injectable } from '@angular/core';
import {
  ActionApiResponse,
  ActionType,
  ComponentActionDto,
  EaisdoResponse,
} from '@epgu/epgu-constructor-types';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable()
export class ActionServiceStub {
  action: ComponentActionDto;
  componentId: string;
  public get actionType$(): Observable<ActionType | null> {
    return of(null);
  }

  navigate(stepType: string): void {}

  navigateModal(stepType: string): void {}

  switchAction(): void {}

  handleExternalIntegrationAction(
    action: ComponentActionDto,
    componentId: string,
  ): Observable<ActionApiResponse<EaisdoResponse>> {
    return of({
      errorList: [],
      responseData: {
        value: { error: null, errorType: null, responseType: null, responseData: null },
        type: null,
      },
    });
  }
}
