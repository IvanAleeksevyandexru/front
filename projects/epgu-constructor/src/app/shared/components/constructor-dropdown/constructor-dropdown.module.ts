import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorDropdownComponent } from './constructor-dropdown.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorDropdownComponent],
  imports: [CommonModule, CoreModule],
  exports: [
    ConstructorDropdownComponent
  ]
})
export class ConstructorDropdownModule {}
