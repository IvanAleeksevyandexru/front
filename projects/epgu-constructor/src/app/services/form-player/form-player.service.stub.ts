import { Injectable } from '@angular/core';
import { FormPlayerApiSuccessResponse } from '../api/form-player-api/form-player-api.types';
import { Display, ScreenTypes } from '../../screen/screen.types';
import { Gender } from '../../shared/types/gender';

@Injectable()
export class FormPlayerServiceStub {
  response: FormPlayerApiSuccessResponse = { scenarioDto: {
      applicantAnswers: {},
      cachedAnswers: {},
      currentScenarioId: '1',
      currentValue: {},
      currentCycledFields: {},
      cycledFields: [],
      finishedAndCurrentScreens: [],
      display: {
        components: [],
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
  componentData: Display;
  isLoading = false;

  getData(): void {}

  nextStep(): void {}

  prevStep(): void {}

  updateRequest(): void {}

  sendDataSuccess(): void {}

  sendDataError(): void {}

  initResponse(): void {}
}
