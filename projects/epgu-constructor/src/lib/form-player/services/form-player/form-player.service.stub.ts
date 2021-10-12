import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  FormPlayerApiSuccessResponse,
  Gender,
  QuizDataDtoResponse,
  ScreenTypes,
} from '@epgu/epgu-constructor-types';

@Injectable()
export class FormPlayerServiceStub {
  _store: FormPlayerApiSuccessResponse = {
    scenarioDto: {
      applicantAnswers: {},
      cachedAnswers: {},
      currentScenarioId: 1,
      currentValue: {},
      finishedAndCurrentScreens: [],
      display: {
        components: [
          {
            attrs: {},
            id: '123',
            label: 'some label',
            type: 'some type',
            value: 'some value',
            required: false,
            visited: false,
          },
        ],
        header: 'some header',
        label: 'some label',
        id: '123',
        name: 'some name',
        terminal: false,
        type: ScreenTypes.UNIQUE,
      },
      errors: {},
      gender: Gender.male,
      orderId: 1,
    },
  };
  componentId: string;
  componentType: string;
  isLoading = false;

  _isLoading$ = of(false);
  _playerLoaded$ = of(false);

  get isLoading$(): Observable<boolean> {
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

  getQuizDataByToken(): Observable<QuizDataDtoResponse> {
    return of({
      data: {
        order: '{}',
      },
    } as QuizDataDtoResponse);
  }

  initPlayerFromQuiz(): void {}

  initPlayerFromOrder(): Observable<{}> {
    return of({});
  }

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
