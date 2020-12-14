import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldListComponent } from './field-list.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [FieldListComponent],
  imports: [CommonModule, CoreModule],
  exports: [FieldListComponent],
})
export class FieldListModule {}
