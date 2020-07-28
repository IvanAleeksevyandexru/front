import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserEmailComponent } from './confirm-personal-user-email.component';
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [ConfirmPersonalUserEmailComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ConfirmPersonalUserEmailModule { }
