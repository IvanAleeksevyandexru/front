import { NgModule } from '@angular/core';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

@NgModule({
  declarations: [ConfirmPersonalUserDataComponent],
  exports: [ConfirmPersonalUserDataComponent],
  imports: [BaseModule, FieldListModule, ScreenPadModule, DefaultUniqueScreenWrapperModule],
  entryComponents: [ConfirmPersonalUserDataComponent]
})
export class ConfirmPersonalUserDataScreenModule {}
