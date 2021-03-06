import { NgModule } from '@angular/core';
import { ScreenButtonsComponent } from './screen-buttons.component';
import { BaseModule } from '../../base.module';
import { DisabledButtonPipe } from './pipes/disabled-button.pipe';
import { ShowLoaderButtonPipe } from './pipes/show-loader-button.pipe';
import { DeviceDetectorService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [ScreenButtonsComponent, DisabledButtonPipe, ShowLoaderButtonPipe],
  imports: [BaseModule],
  exports: [ScreenButtonsComponent],
  providers: [DeviceDetectorService, WINDOW_PROVIDERS],
})
export class ScreenButtonsModule {}
