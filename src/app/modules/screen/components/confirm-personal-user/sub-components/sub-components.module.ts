import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../../../../module-share/shared-components.module';
import { ConfirmPersonalUserButtonComponent } from './confirm-personal-user-button/confirm-personal-user-button.component';
import {
  ConfirmPersonalUserScreenLayoutComponent
} from './confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';

const COMPONENTS = [
  ConfirmPersonalUserButtonComponent,
  ConfirmPersonalUserScreenLayoutComponent,
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
