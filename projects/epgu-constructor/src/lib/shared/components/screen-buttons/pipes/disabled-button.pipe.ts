import { Pipe, PipeTransform } from '@angular/core';
import { ScreenButton, ActionType } from '@epgu/epgu-constructor-types';

@Pipe({
  name: 'disabledButton',
})
export class DisabledButtonPipe implements PipeTransform {
  transform(
    button: ScreenButton,
    disabled: boolean,
    disabledForAll: boolean,
    isLoading: boolean,
  ): boolean {
    return (
      button.disabledByRel ||
      (disabled && disabledForAll) ||
      (disabled &&
        !disabledForAll &&
        (button.type === ActionType.deliriumNextStep ||
          button.type === ActionType.nextStep ||
          button.type === ActionType.nextStepModal)) ||
      isLoading
    );
  }
}
