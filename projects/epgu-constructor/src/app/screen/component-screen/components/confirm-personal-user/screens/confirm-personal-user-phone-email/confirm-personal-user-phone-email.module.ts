import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';

const COMPONENTS = [
  ConfirmPersonalUserPhoneEmailComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
    EpguLibModule,
  ],
})
export class ConfirmPersonalUserPhoneEmailModule { }
