import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserButtonComponent } from './confirm-personal-user-button/confirm-personal-user-button.component';
import { ConfirmPersonalUserEmailComponent } from './confirm-personal-user-email/confirm-personal-user-email.component';
import { ConfirmPersonalUserScreenLayoutComponent } from './confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';

const COMPONENTS = [
  ConfirmPersonalUserButtonComponent,
  ConfirmPersonalUserEmailComponent,
  ConfirmPersonalUserScreenLayoutComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule
  ]
})
export class SubComponentsModule { }
