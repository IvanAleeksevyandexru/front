import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserEmailComponent } from './components/confirm-personal-user-email/confirm-personal-user-email.component';
import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';

const COMPONENTS = [ConfirmPersonalUserEmailScreenComponent, ConfirmPersonalUserEmailComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserEmailScreenModule { }
