import { Injectable } from '@angular/core';
import {
  DisplayInterface,
  ResponseInterface
} from '../interfaces/epgu.service.interface';
import { SCREEN_TYPE } from '../constant/global';


@Injectable()
export class FormPlayerServiceStub {
  response: ResponseInterface = { scenarioDto: {
      applicantAnswers: {},
      currentRule: 1,
      currentValue: {},
      currentCycledFields: {},
      cycledFields: [],
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
      gender: 'male',
      orderId: '1',
      sendNotification: [],
      token: 'someSecret',
      userId: '12552'
    }};
  componentId: string;
  componentType: string;
  componentData: DisplayInterface;
  isLoading = false;

  getData(): void {}

  nextStep(): void {}

  prevStep(): void {}

  updateRequest(): void {}

  sendDataSuccess(): void {}

  sendDataError(): void {}

  initResponse(): void {}
}
