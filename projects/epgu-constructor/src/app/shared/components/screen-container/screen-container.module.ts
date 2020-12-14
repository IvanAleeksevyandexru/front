import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenContainerComponent } from './screen-container.component';
import { NavigationModule } from '../navigation/navigation.module';

@NgModule({
  declarations: [ScreenContainerComponent],
  imports: [CommonModule, NavigationModule],
  exports: [ScreenContainerComponent],
})
export class ScreenContainerModule {}
