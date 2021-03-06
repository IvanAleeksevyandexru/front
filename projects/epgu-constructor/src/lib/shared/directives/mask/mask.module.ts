import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaskTransformDirective } from './mask-transform.directive';
import { MaskTransformService } from '../../services/mask-transform/mask-transform.service';

@NgModule({
  declarations: [MaskTransformDirective],
  imports: [CommonModule],
  exports: [MaskTransformDirective],
  providers: [DecimalPipe, MaskTransformService],
})
export class MaskModule {}
