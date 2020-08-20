import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';
import { ConfirmPersonalUserEmailComponent } from './components/confirm-personal-user-email/confirm-personal-user-email.component';
import { SharedModule } from '../../../../../../shared-module/shared-components.module';

const COMPONENTS = [ConfirmPersonalUserEmailScreenComponent, ConfirmPersonalUserEmailComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserEmailScreenModule { }
