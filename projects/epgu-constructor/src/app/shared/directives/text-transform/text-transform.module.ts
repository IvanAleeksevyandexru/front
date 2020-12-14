import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextTransformDirective } from './text-transform.directive';

@NgModule({
  declarations: [TextTransformDirective],
  imports: [CommonModule],
  exports: [TextTransformDirective],
})
export class TextTransformModule {}
