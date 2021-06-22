import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenContainerComponent } from './screen-container.component';
import { PrevButtonModule } from '../prev-button/prev-button.module';

@NgModule({
  declarations: [ScreenContainerComponent],
  imports: [CommonModule, PrevButtonModule],
  exports: [ScreenContainerComponent],
})
export class ScreenContainerModule {}
