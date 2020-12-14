import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CurrencyTransformDirective } from './currency-transform.directive';

@NgModule({
  declarations: [CurrencyTransformDirective],
  imports: [CommonModule],
  exports: [CurrencyTransformDirective],
  providers: [CurrencyPipe],
})
export class CurrencyModule {}
