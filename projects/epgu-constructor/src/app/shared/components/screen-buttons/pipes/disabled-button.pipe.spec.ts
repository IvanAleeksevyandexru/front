import { DisabledButtonPipe } from './disabled-button.pipe';
import { ActionType, DTOActionAction } from 'epgu-constructor-types/dist/base/component-action-dto';
import { ScreenButton } from 'epgu-constructor-types/dist/base/screen-buttons';

describe('DisabledButtonPipe', () => {
  let pipe: DisabledButtonPipe;
  let button: ScreenButton;
  let disabled: boolean;
  let disabledForAll: boolean;
  let isLoading: boolean;

  beforeEach(() => {
    pipe = new DisabledButtonPipe();
    button = {
      action: DTOActionAction.getNextStep,
      type: ActionType.nextStep,
      label: 'Далее'
    };
    isLoading = false;
    disabled = true;
    disabledForAll = true;
  });

  it('should return true for disabledForAll when disabled and not isLoading case', () => {
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return true if disabled and NOT disabledForAll and button.type is deliriumNextStep or nextStep', () => {
    button = {
      action: DTOActionAction.reject,
      type: ActionType.nextStep,
      label: 'Отклонить'
    };
    disabledForAll = false;

    let result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();

    button = {
      action: DTOActionAction.reject,
      type: ActionType.deliriumNextStep,
      label: 'Отклонить'
    };
    result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return false for not disabledForAll when disabled and not isLoading and not getNext or deliriumNextStep type case', () => {
    button = {
      action: DTOActionAction.reject,
      type: ActionType.home,
      label: 'Отклонить'
    };
    disabledForAll = false;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeFalsy();
  });

  it('should return true for not disabledForAll when disabled and not isLoading and not getNext or deliriumNextStep type case', () => {
    disabledForAll = false;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return true for isLoading case', () => {
    isLoading = true;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return false for not disabledForAll when not disabled and not isLoading and not getNext or deliriumNextStep type case', () => {
    disabled = false;
    disabledForAll = false;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeFalsy();
  });
});
