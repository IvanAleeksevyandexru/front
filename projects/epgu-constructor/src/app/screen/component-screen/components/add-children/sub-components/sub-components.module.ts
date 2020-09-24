import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../../shared/shared.module';
import { QuestionsScreenModule } from '../../../../questions-screen/questions-screen.module';
import {
  ConfirmPersonalUserAddressScreenModule
  // eslint-disable-next-line max-len
} from '../../confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import { SubComponentsModule as ConfirmPersonalUserSubComponentsModule } from '../../confirm-personal-user/sub-components/sub-components.module';
import { AddNewChildFormComponent } from './add-new-child-form/add-new-child-form.component';

const COMPONENTS = [
  AddNewChildFormComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
      CommonModule,
      SharedModule,
      QuestionsScreenModule,
      ConfirmPersonalUserAddressScreenModule,
      ConfirmPersonalUserSubComponentsModule,
      EpguLibModule,
      FormsModule,
  ],
})
export class SubComponentsModule {}
