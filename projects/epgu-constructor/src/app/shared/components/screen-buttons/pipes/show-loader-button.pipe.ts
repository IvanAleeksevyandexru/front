import { Pipe, PipeTransform } from '@angular/core';
import { ScreenButton } from 'epgu-constructor-types/dist/base/screen-buttons';

@Pipe({
  name: 'showLoaderButton',
})
export class ShowLoaderButtonPipe implements PipeTransform {
  transform(button: ScreenButton, clickedButton: ScreenButton, isLoading: boolean): boolean {
    return isLoading && clickedButton === button;
  }
}
