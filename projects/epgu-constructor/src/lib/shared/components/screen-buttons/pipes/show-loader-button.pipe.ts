import { Pipe, PipeTransform } from '@angular/core';
import { ScreenButton } from '@epgu/epgu-constructor-types';

@Pipe({
  name: 'showLoaderButton',
})
export class ShowLoaderButtonPipe implements PipeTransform {
  transform(button: ScreenButton, clickedButton: ScreenButton, isLoading: boolean): boolean {
    return isLoading && clickedButton === button;
  }
}
