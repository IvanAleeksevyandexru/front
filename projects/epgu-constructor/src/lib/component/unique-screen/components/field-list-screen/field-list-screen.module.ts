import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { FieldListScreenComponent } from './field-list-screen.component';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';

@NgModule({
  declarations: [FieldListScreenComponent],
  imports: [CommonModule, DefaultUniqueScreenWrapperModule, ScreenPadModule, FieldListModule],
  exports: [FieldListScreenComponent],
  entryComponents: [FieldListScreenComponent],
})
export class FieldListScreenModule {}
