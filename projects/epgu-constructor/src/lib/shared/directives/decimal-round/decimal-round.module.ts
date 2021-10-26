import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DecimalRoundDirective } from './decimal-round.directive';
import { MaskTransformService } from '../../services/mask-transform/mask-transform.service';

@NgModule({
  declarations: [DecimalRoundDirective],
  imports: [CommonModule],
  exports: [DecimalRoundDirective],
  providers: [DecimalPipe, MaskTransformService],
})
export class DecimalRoundModule {}
