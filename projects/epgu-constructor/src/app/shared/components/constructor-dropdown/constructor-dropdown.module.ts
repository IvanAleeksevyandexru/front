import { NgModule } from '@angular/core';

import { ConstructorDropdownComponent } from './constructor-dropdown.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorDropdownComponent],
  imports: [BaseModule],
  exports: [
    ConstructorDropdownComponent
  ]
})
export class ConstructorDropdownModule {}
