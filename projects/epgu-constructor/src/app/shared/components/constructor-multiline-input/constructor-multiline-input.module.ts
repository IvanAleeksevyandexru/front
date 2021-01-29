import { NgModule } from '@angular/core';

import { TrimModule } from '../../directives/trim/trim.module';
import { TextTransformModule } from '../../directives/text-transform/text-transform.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';
import { ConstructorMultilineInputComponent } from './constructor-multiline-input.component';

@NgModule({
  declarations: [ConstructorMultilineInputComponent],
  imports: [BaseModule, TrimModule, TextTransformModule, ValidationTypeModule],
  exports: [ConstructorMultilineInputComponent],
})
export class ConstructorMultilineInputModule {}
