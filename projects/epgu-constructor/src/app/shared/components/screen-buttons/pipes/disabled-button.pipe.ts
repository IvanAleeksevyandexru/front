import { Pipe, PipeTransform } from '@angular/core';
import { ActionType, ScreenActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

@Pipe({
  name: 'disabledButton',
})
export class DisabledButtonPipe implements PipeTransform {
  transform(button: ScreenActionDto, disabled: boolean, disabledForAll: boolean, isLoading: boolean): boolean {
    return (disabled && disabledForAll)
      || (disabled && !disabledForAll && button.type === ActionType.nextStep)
      || isLoading;
  }
}
