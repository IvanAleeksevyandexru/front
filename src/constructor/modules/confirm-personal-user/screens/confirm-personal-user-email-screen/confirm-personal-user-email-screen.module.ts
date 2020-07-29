import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../../shared/shared.module';
import {ConfirmPersonalUserShareModule} from '../../modules/confirm-personal-user-share/confirm-personal-user-share.module';
import { ConfirmPersonalUserEmailComponent } from './component/confirm-personal-user-email/confirm-personal-user-email.component';
import {ConfirmPersonalUserEmailScreenComponent} from './confirm-personal-user-email-screen.component';

const COMPONENTS = [
  ConfirmPersonalUserEmailScreenComponent,
  ConfirmPersonalUserEmailComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    ConfirmPersonalUserShareModule,
  ]
})
export class ConfirmPersonalUserEmailScreenModule { }
