import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { EpgucSharedModule } from '../../../../../../shared-module/shared-components.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserEmailComponent } from './components/confirm-personal-user-email/confirm-personal-user-email.component';
import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';

const COMPONENTS = [ConfirmPersonalUserEmailScreenComponent];

@NgModule({
  declarations: [...COMPONENTS, ConfirmPersonalUserEmailComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserEmailScreenModule { }
