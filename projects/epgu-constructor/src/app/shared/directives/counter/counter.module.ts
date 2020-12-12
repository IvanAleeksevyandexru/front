import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterDirective } from './counter.directive';

@NgModule({
  declarations: [CounterDirective],
  imports: [CommonModule],
  exports: [CounterDirective],
})
export class CounterModule {}
