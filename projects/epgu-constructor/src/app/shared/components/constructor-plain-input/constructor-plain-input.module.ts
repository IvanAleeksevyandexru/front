import { NgModule } from '@angular/core';

import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { TextTransformModule, TrimModule } from '@epgu/epgu-constructor-ui-kit';
import { CurrencyModule } from '../../directives/currency/currency.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';
import { RankModule } from '../../directives/rank/rank.module';

@NgModule({
  declarations: [ConstructorPlainInputComponent],
  imports: [
    BaseModule,
    TrimModule,
    TextTransformModule,
    CurrencyModule,
    ValidationTypeModule,
    RankModule,
  ],
  exports: [ConstructorPlainInputComponent],
})
export class ConstructorPlainInputModule {}
