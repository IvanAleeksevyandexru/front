import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../../../core/core.module';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';

@NgModule({
  declarations: [ConfirmPersonalUserDataComponent],
  exports: [ConfirmPersonalUserDataComponent],
  imports: [CoreModule, FieldListModule, ActionModule, ScreenPadModule],
})
export class ConfirmPersonalUserDataScreenModule {}
