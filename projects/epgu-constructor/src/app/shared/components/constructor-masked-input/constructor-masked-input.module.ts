import { NgModule } from '@angular/core';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { TrimModule } from '../../directives/trim/trim.module';
import { TextTransformModule } from '../../directives/text-transform/text-transform.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';
import { MaskModule } from '../../directives/mask/mask.module';

@NgModule({
  declarations: [ConstructorMaskedInputComponent],
  imports: [BaseModule, TrimModule, TextTransformModule, ValidationTypeModule, MaskModule],
  exports: [ConstructorMaskedInputComponent],
})
export class ConstructorMaskedInputModule {}
