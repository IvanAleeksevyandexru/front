import { NgModule } from '@angular/core';
import { FieldListComponent } from './field-list.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [FieldListComponent],
  imports: [BaseModule],
  exports: [FieldListComponent],
})
export class FieldListModule {}
