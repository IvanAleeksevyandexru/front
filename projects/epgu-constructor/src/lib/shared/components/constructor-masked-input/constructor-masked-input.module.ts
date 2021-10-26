import { NgModule } from '@angular/core';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { TextTransformModule, TrimModule } from '@epgu/epgu-constructor-ui-kit';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';
import { MaskModule } from '../../directives/mask/mask.module';
import { DecimalRoundModule } from '../../directives/decimal-round/decimal-round.module';

@NgModule({
  declarations: [ConstructorMaskedInputComponent],
  imports: [BaseModule, DecimalRoundModule, TrimModule, TextTransformModule, ValidationTypeModule, MaskModule],
  exports: [ConstructorMaskedInputComponent],
})
export class ConstructorMaskedInputModule {}
