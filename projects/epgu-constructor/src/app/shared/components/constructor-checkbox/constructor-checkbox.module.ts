import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorCheckboxComponent } from './constructor-checkbox.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorCheckboxComponent],
  imports: [CommonModule, CoreModule],
  exports: [
    ConstructorCheckboxComponent
  ]
})
export class ConstructorCheckboxModule {}
