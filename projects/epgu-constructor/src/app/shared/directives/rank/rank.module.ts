import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RankTransformDirective } from './rank-transform.directive';

@NgModule({
  declarations: [RankTransformDirective],
  imports: [CommonModule],
  exports: [RankTransformDirective],
  providers: [DecimalPipe],
})
export class RankModule {}
