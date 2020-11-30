import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorPlainInputComponent } from './constructor-plain-input.component';
import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorPlainInputComponent],
  imports: [CommonModule, SharedModule, CoreModule],
  exports: [
    ConstructorPlainInputComponent
  ]
})
export class ConstructorPlainInputModule {}
