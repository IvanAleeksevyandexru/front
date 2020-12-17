import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { CoreModule } from '../../../core/core.module';
import { TrimModule } from '../../directives/trim/trim.module';
import { TextTransformModule } from '../../directives/text-transform/text-transform.module';
import { CurrencyModule } from '../../directives/currency/currency.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';

@NgModule({
  declarations: [ConstructorPlainInputComponent],
  imports: [CommonModule, CoreModule, TrimModule, TextTransformModule, CurrencyModule, ValidationTypeModule],
  exports: [ConstructorPlainInputComponent],
})
export class ConstructorPlainInputModule {}
