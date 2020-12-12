import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';
import { TrimModule } from '../../directives/trim/trim.module';
import { TextTransformModule } from '../../directives/text-transform/text-transform.module';
import { CurrencyModule } from '../../directives/currency/currency.module';

@NgModule({
  declarations: [ConstructorPlainInputComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    TrimModule,
    TextTransformModule,
    CurrencyModule,
  ],
  exports: [ConstructorPlainInputComponent],
})
export class ConstructorPlainInputModule {}
