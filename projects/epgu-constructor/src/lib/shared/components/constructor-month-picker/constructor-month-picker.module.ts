import { NgModule } from '@angular/core';

import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorMonthPickerComponent],
  imports: [BaseModule],
  exports: [ConstructorMonthPickerComponent],
})
export class ConstructorMonthPickerModule {}
