import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedComponentsModule} from '../../../shared-components/shared-components.module';
import {EpguLibModule} from 'epgu-lib';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';

const COMPONENTS = [ConfirmPersonalUserEmailScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserEmailScreenModule { }
