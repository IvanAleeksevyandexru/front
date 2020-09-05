import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../../../constant/global';
import {
  Display,
  FormPlayerApiResponse
} from '../api/form-player-api/form-player-api.types';


@Injectable()
export class FormPlayerServiceStub {
  response: FormPlayerApiResponse = { scenarioDto: {
      applicantAnswers: {},
      currentRule: 1,
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
        type: SCREEN_TYPE.COMPONENT
      },
      errors: {},
      gender: 'M',
      orderId: '1',
      sendNotification: [],
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
