import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskHandlePipe } from './mask-handle.pipe';

@NgModule({
  declarations: [MaskHandlePipe],
  imports: [CommonModule],
  exports: [MaskHandlePipe],
})
export class MaskHandleModule {}
