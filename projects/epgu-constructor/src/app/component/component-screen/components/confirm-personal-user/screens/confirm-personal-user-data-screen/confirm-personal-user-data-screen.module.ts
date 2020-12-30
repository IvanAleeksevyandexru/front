import { NgModule } from '@angular/core';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../../../shared/base.module';

@NgModule({
  declarations: [ConfirmPersonalUserDataComponent],
  exports: [ConfirmPersonalUserDataComponent],
  imports: [BaseModule, FieldListModule, ScreenPadModule],
})
export class ConfirmPersonalUserDataScreenModule {}
