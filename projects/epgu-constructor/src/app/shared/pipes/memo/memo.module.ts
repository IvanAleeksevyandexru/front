import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemoPipe } from './memo.pipe';

@NgModule({
  declarations: [MemoPipe],
  imports: [CommonModule],
  exports: [MemoPipe],
})
export class MemoModule {}
