import { NgModule } from '@angular/core';

import { ConstructorCheckboxComponent } from './constructor-checkbox.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorCheckboxComponent],
  imports: [BaseModule],
  exports: [ConstructorCheckboxComponent]
})
export class ConstructorCheckboxModule {}
