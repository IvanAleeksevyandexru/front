import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextTransformDirective } from './text-transform.directive';
import { TextTransformService } from '../../../core/services/text-transform/text-transform.service';

@NgModule({
  declarations: [TextTransformDirective],
  imports: [CommonModule],
  exports: [TextTransformDirective],
  providers: [TextTransformService]
})
export class TextTransformModule {}
