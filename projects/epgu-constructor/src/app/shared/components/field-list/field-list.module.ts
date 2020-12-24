import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldListComponent } from './field-list.component';
import { CoreModule } from '../../../core/core.module';
import { ScreenPadModule } from '../screen-pad/screen-pad.module';

@NgModule({
  declarations: [FieldListComponent],
  imports: [CommonModule, CoreModule, ScreenPadModule],
  exports: [FieldListComponent],
})
export class FieldListModule {}
