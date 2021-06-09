import { NgModule } from '@angular/core';

import { ConstructorDropdownComponent } from './constructor-dropdown.component';
import { BaseUiModule } from '../../base-ui.module';

@NgModule({
  declarations: [ConstructorDropdownComponent],
  imports: [BaseUiModule],
  exports: [
    ConstructorDropdownComponent
  ]
})
export class ConstructorDropdownModule {}
