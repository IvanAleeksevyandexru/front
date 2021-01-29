import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { ComponentWrapperModule } from '../../shared/component-wrapper.module';
import { FieldListScreenComponent } from './field-list-screen.component';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';

@NgModule({
  declarations: [FieldListScreenComponent],
  imports: [
    CommonModule,
    ComponentWrapperModule,
    ScreenPadModule,
    FieldListModule,
  ],
  exports: [FieldListScreenComponent],
  entryComponents: [FieldListScreenComponent]
})
export class FieldListScreenModule {}
