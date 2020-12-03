import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { SharedModule } from '../../../shared.module';
import { CoreModule } from '../../../../core/core.module';

@NgModule({
  declarations: [ConstructorMaskedInputComponent],
  imports: [CommonModule, SharedModule, CoreModule],
  exports: [ConstructorMaskedInputComponent],
})
export class ConstructorMaskedInputModule {}
