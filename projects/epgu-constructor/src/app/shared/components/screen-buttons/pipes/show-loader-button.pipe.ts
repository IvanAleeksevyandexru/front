import { Pipe, PipeTransform } from '@angular/core';
import { ScreenActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

@Pipe({
  name: 'showLoaderButton',
})
export class ShowLoaderButtonPipe implements PipeTransform {
  transform(button: ScreenActionDto, clickedButton: ScreenActionDto, isLoading: boolean): boolean {
    return isLoading && clickedButton === button;
  }
}
