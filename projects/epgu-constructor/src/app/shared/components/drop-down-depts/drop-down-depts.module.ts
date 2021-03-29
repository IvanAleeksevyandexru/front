import { NgModule } from '@angular/core';
import { DropDownDeptsComponent } from './drop-down-depts.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [DropDownDeptsComponent],
  imports: [BaseModule],
  exports: [DropDownDeptsComponent],
})
export class DropDownDeptsModule {}
