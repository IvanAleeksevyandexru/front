import { NgModule } from '@angular/core';
import { ScreenButtonsComponent } from './screen-buttons.component';
import { NavigationModule } from '../navigation/navigation.module';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ScreenButtonsComponent],
  imports: [BaseModule, NavigationModule],
  exports: [ScreenButtonsComponent],
})
export class ScreenButtonsModule {}
