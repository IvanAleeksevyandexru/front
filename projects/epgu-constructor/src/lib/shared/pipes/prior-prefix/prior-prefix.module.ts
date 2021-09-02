import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorPrefixPipe } from './prior-prefix.pipe';

@NgModule({
  declarations: [PriorPrefixPipe],
  imports: [CommonModule],
  exports: [PriorPrefixPipe],
})
export class PriorPrefixModule {}
