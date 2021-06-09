import { NgModule } from '@angular/core';

import { TextTransformModule, TrimModule } from '@epgu/epgu-constructor-ui-kit';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';
import { ConstructorMultilineInputComponent } from './constructor-multiline-input.component';

@NgModule({
  declarations: [ConstructorMultilineInputComponent],
  imports: [BaseModule, TrimModule, TextTransformModule, ValidationTypeModule],
  exports: [ConstructorMultilineInputComponent],
})
export class ConstructorMultilineInputModule {}
