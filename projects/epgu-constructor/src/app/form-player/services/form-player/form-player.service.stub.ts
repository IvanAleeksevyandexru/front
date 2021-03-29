import { Injectable } from '@angular/core';
import { FormPlayerApiSuccessResponse, ScenarioDto } from '../form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../screen/screen.types';
import { Gender } from '../../../shared/types/gender';
import { Observable, of } from 'rxjs';

@Injectable()
export class FormPlayerServiceStub {
  _store: FormPlayerApiSuccessResponse = { scenarioDto: {
      applicantAnswers: {},
      cachedAnswers: {},
      currentScenarioId: 1,
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
        type: ScreenTypes.UNIQUE
      },
      errors: {},
      gender: Gender.male,
      orderId: 1,
    }};
  componentId: string;
  componentType: string;
  isLoading = false;

  _isLoading$ = of(false);
  _playerLoaded$ = of(false);

  get isLoading$(): Observable<boolean>  {
    return this._isLoading$;
  }

  get playerLoaded$(): Observable<boolean> {
    return this._playerLoaded$;
  }

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

  getBooking(): void {}

  processResponse(): void {}

  initPlayerFromQuiz(): void {}

  checkIfOrderExist(): Observable<{}> {
    return of({});
  }

  patchStore(): void {}

  getOrderStatus(): Observable<{}> {
    return of({});
  }

  isNeedToShowLastScreen(): boolean {
    return false;
  }
}
