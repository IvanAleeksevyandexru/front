import { NgModule } from '@angular/core';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserLegalDataComponent } from './component/confirm-personal-user-legal-data/confirm-personal-user-legal-data.component';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { ConfirmPersonalUserDataPipe } from './component/confirm-personal-user-data/confirm-personal-user-data.pipe';

@NgModule({
  declarations: [ConfirmPersonalUserDataComponent, ConfirmPersonalUserLegalDataComponent, ConfirmPersonalUserDataPipe],
  exports: [ConfirmPersonalUserDataComponent],
  imports: [
    BaseModule,
    FieldListModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    DisclaimerModule,
  ],
  entryComponents: [ConfirmPersonalUserDataComponent, ConfirmPersonalUserLegalDataComponent],
})
export class ConfirmPersonalUserDataScreenModule {}
