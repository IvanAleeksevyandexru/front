import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorDatePickerComponent } from './constructor-date-picker.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorDatePickerComponent],
  imports: [CommonModule, CoreModule],
  exports: [ConstructorDatePickerComponent],
})
export class ConstructorDatePickerModule {}
