import { ShowLoaderButtonPipe } from './show-loader-button.pipe';
import { DTOActionAction, ScreenActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

describe('ShowLoaderButtonPipe', () => {
  let pipe: ShowLoaderButtonPipe;
  let button: ScreenActionDto;
  let clickedButton: ScreenActionDto;
  let isLoading: boolean;

  beforeEach(() => {
    pipe = new ShowLoaderButtonPipe();
    button = {
      action: DTOActionAction.getNextStep,
      label: 'Далее'
    };
    isLoading = true;
  });

  it('should return true for clickedButton when isLoading', () => {
    clickedButton = button;
    const result = pipe.transform(button, clickedButton, isLoading);
    expect(result).toBeTruthy();
  });

  it('should return false for not clickedButton when isLoading', () => {
    clickedButton = {
      action: DTOActionAction.reject,
      label: 'Отклонить'
    };
    const result = pipe.transform(button, clickedButton, isLoading);
    expect(result).toBeFalsy();
  });

  it('should return false for clickedButton when not isLoading', () => {
    clickedButton = button;
    isLoading = false;
    const result = pipe.transform(button, clickedButton, isLoading);
    expect(result).toBeFalsy();
  });

  it('should return false for not clickedButton when not isLoading', () => {
    clickedButton = {
      action: DTOActionAction.reject,
      label: 'Отклонить'
    };
    isLoading = false;
    const result = pipe.transform(button, clickedButton, isLoading);
    expect(result).toBeFalsy();
  });
});
