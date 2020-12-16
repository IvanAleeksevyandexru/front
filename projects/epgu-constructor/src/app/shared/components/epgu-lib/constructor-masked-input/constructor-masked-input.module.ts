import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { CoreModule } from '../../../../core/core.module';
import { TrimModule } from '../../../directives/trim/trim.module';
import { TextTransformModule } from '../../../directives/text-transform/text-transform.module';
import { ValidationTypeModule } from '../../../directives/validation-type/validation-type.module';

@NgModule({
  declarations: [ConstructorMaskedInputComponent],
  imports: [CommonModule, CoreModule, TrimModule, TextTransformModule, ValidationTypeModule],
  exports: [ConstructorMaskedInputComponent],
})
export class ConstructorMaskedInputModule {}
