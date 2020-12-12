import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';

@NgModule({
  declarations: [ConfirmPersonalUserDataComponent],
  exports: [ConfirmPersonalUserDataComponent],
  imports: [CoreModule, SharedModule, FieldListModule, ActionModule],
})
export class ConfirmPersonalUserDataScreenModule {}
