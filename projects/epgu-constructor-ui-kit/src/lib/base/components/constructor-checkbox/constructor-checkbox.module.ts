import { NgModule } from '@angular/core';

import { ConstructorCheckboxComponent } from './constructor-checkbox.component';
import { BaseUiModule } from '../../base-ui.module';

@NgModule({
  declarations: [ConstructorCheckboxComponent],
  imports: [BaseUiModule],
  exports: [ConstructorCheckboxComponent]
})
export class ConstructorCheckboxModule {}
