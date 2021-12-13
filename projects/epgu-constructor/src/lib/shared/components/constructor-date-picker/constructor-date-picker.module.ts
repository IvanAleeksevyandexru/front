import { NgModule } from '@angular/core';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';

import { ConstructorDatePickerComponent } from './constructor-date-picker.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorDatePickerComponent],
  imports: [BaseModule, ValidationTypeModule],
  exports: [ConstructorDatePickerComponent],
})
export class ConstructorDatePickerModule {}
