import { Injectable } from '@angular/core';
import { ComponentActionDto, DisplayDto, FormPlayerApiSuccessResponse } from '../form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../screen/screen.types';
import { Gender } from '../../../shared/types/gender';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerServiceStub {
  _store: FormPlayerApiSuccessResponse = { scenarioDto: {
      applicantAnswers: {},
      cachedAnswers: {},
      currentScenarioId: '1',
      currentValue: {},
      finishedAndCurrentScreens: [],
      display: {
        components: [{
          attrs: {},
          id: '123',
          label: 'some label',
          type: 'some type',
          value: 'some value',
          required: false,
          visited: false
        }],
        header: 'some header',
        label: 'some label',
        id: '123',
        name: 'some name',
        submitLabel: 'some submit label',
        terminal: false,
        type: ScreenTypes.COMPONENT
      },
      errors: {},
      gender: Gender.male,
      orderId: '1',
      token: 'someSecret',
      userId: '12552'
    }};
  componentId: string;
  componentType: string;
  isLoading = false;

  get store(): FormPlayerApiSuccessResponse {
    return this._store;
  }

  set store(store: FormPlayerApiSuccessResponse) {
    this._store = store;
  }

  updateRequest(): void {}

  sendDataSuccess(): void {}

  sendDataError(): void {}

  initResponse(): void {}

  initData(): void {}

  navigate(): void {}

  checkIfOrderExist(): Observable<{}> {
    return of({});
  }

  isNeedToShowLastScreen(): boolean {
    return false;
  }
}
