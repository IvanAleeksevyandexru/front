import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyTransformDirective } from './currency-transform.directive';

@NgModule({
  declarations: [CurrencyTransformDirective],
  imports: [CommonModule],
  exports: [CurrencyTransformDirective],
})
export class CurrencyModule {}
