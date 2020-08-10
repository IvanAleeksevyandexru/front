import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EpgucSharedModule} from '@epgu-constructor';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';
import {ConfirmPersonalUserEmailComponent} from './components/confirm-personal-user-email/confirm-personal-user-email.component';

const COMPONENTS = [ConfirmPersonalUserEmailScreenComponent];

@NgModule({
  declarations: [...COMPONENTS, ConfirmPersonalUserEmailComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserEmailScreenModule { }
