import { NgModule } from '@angular/core';

import { ConstructorDatePickerComponent } from './constructor-date-picker.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorDatePickerComponent],
  imports: [BaseModule],
  exports: [ConstructorDatePickerComponent],
})
export class ConstructorDatePickerModule {}
