import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaskTransformDirective } from './mask-transform.directive';

@NgModule({
  declarations: [MaskTransformDirective],
  imports: [CommonModule],
  exports: [MaskTransformDirective],
  providers: [DecimalPipe],
})
export class MaskModule {}
