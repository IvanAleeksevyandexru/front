import { NgModule } from '@angular/core';
import { DropDownDeptsComponent } from './drop-down-depts.component';
import { BaseModule } from '../../base.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';

@NgModule({
  declarations: [DropDownDeptsComponent],
  imports: [BaseModule, ValidationTypeModule],
  exports: [DropDownDeptsComponent],
})
export class DropDownDeptsModule {}
