import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorMonthPickerComponent],
  imports: [CommonModule, CoreModule],
  exports: [
    ConstructorMonthPickerComponent
  ]
})
export class ConstructorMonthPickerModule {}
