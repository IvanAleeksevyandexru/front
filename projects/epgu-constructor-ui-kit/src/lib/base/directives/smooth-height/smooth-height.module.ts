import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothHeightAnimationDirective } from './smooth-height.directive';

@NgModule({
  declarations: [SmoothHeightAnimationDirective],
  imports: [CommonModule],
  exports: [SmoothHeightAnimationDirective],
})
export class SmoothHeightAnimationDirectiveModule {}
