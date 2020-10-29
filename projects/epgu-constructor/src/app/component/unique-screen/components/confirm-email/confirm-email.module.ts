import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EpguLibModule } from 'epgu-lib';


@NgModule({
  declarations: [ConfirmEmailComponent],
  exports: [ConfirmEmailComponent],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
  ]
})
export class ConfirmEmailModule { }
