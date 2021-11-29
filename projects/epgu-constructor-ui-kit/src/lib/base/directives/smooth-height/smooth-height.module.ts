import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothHeightAnimDirective } from './smooth-height.directive';

@NgModule({
  declarations: [SmoothHeightAnimDirective],
  imports: [CommonModule],
  exports: [SmoothHeightAnimDirective],
})
export class SmoothHeightAnimDirectiveModule {}
