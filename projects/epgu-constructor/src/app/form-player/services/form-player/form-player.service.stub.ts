import { Injectable } from '@angular/core';
import { ComponentDtoAction, DisplayDto, FormPlayerApiSuccessResponse } from '../form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../screen/screen.types';
import { Gender } from '../../../shared/types/gender';

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
  componentData: DisplayDto;
  isLoading = false;

  getData(): void {}

  nextStep(): void {}

  prevStep(): void {}

  updateRequest(): void {}

  sendDataSuccess(): void {}

  sendDataError(): void {}

  initResponse(): void {}
}
