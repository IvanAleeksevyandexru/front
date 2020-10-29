import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPhoneComponent } from './components/confirm-phone/confirm-phone.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EpguLibModule } from 'epgu-lib';



@NgModule({
  declarations: [ConfirmPhoneComponent],
  exports: [ConfirmPhoneComponent],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
  ]
})
export class ConfirmPhoneModule { }
