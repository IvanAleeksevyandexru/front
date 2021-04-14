import { ActionType, DTOActionAction, ScreenActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { DisabledButtonPipe } from './disabled-button.pipe';

describe('DisabledButtonPipe', () => {
  let pipe: DisabledButtonPipe;
  let button: ScreenActionDto;
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

  it('should return true for  disabledForAll when disabled and not isLoading case', () => {
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return false for not disabledForAll when disabled and not isLoading and not getNext type case', () => {
    button = {
      action: DTOActionAction.reject,
      type: ActionType.home,
      label: 'Отклонить'
    };
    disabledForAll = false;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeFalsy();
  });

  it('should return true for not disabledForAll when disabled and not isLoading and not getNext type case', () => {
    disabledForAll = false;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return true for isLoading case', () => {
    isLoading = true;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return false for not disabledForAll when not disabled and not isLoading and not getNext type case', () => {
    disabled = false;
    disabledForAll = false;
    const result = pipe.transform(button, disabled, disabledForAll, isLoading);
    expect(result).toBeFalsy();
  });
});
