import { NgModule } from '@angular/core';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { ComponentWrapperModule } from '../../../../shared/component-wrapper.module';

@NgModule({
  declarations: [ConfirmPersonalUserDataComponent],
  exports: [ConfirmPersonalUserDataComponent],
  imports: [BaseModule, FieldListModule, ScreenPadModule, ComponentWrapperModule],
  entryComponents: [ConfirmPersonalUserDataComponent]
})
export class ConfirmPersonalUserDataScreenModule {}
