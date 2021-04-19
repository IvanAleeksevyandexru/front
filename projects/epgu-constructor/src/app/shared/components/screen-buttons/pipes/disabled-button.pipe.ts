import { Pipe, PipeTransform } from '@angular/core';
import { ScreenButton } from 'epgu-constructor-types/dist/base/screen-buttons';
import { ActionType } from 'epgu-constructor-types/dist/base/component-action-dto';

@Pipe({
  name: 'disabledButton',
})
export class DisabledButtonPipe implements PipeTransform {
  transform(button: ScreenButton, disabled: boolean, disabledForAll: boolean, isLoading: boolean): boolean {
    return (disabled && disabledForAll)
      || (disabled && !disabledForAll && button.type === ActionType.nextStep)
      || isLoading;
  }
}
