import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { SharedModule } from '../../../shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ValidationTypeModule } from '../../../directives/validation-type/validation-type.module';

@NgModule({
  declarations: [ConstructorMaskedInputComponent],
  imports: [CommonModule, SharedModule, CoreModule, ValidationTypeModule],
  exports: [ConstructorMaskedInputComponent],
})
export class ConstructorMaskedInputModule {}
