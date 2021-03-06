import { NgModule } from '@angular/core';

import {
  TextTransformModule,
  TrimModule,
  CurrencyModule,
  RankPipeModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorPlainInputComponent],
  imports: [
    BaseModule,
    TrimModule,
    TextTransformModule,
    CurrencyModule,
    ValidationTypeModule,
    RankPipeModule,
  ],
  exports: [ConstructorPlainInputComponent],
})
export class ConstructorPlainInputModule {}
