import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserScreenLayoutComponent } from './components/confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import {SharedModule} from '../../../../../shared/shared.module';
import { ConfirmPersonalUserButtonComponent } from './components/confirm-personal-user-button/confirm-personal-user-button.component';


const COMPONENTS = [
  ConfirmPersonalUserScreenLayoutComponent,
  ConfirmPersonalUserButtonComponent
];


@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ConfirmPersonalUserShareModule { }
