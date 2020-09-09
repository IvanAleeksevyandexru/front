import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { FormsModule } from '@angular/forms';

const COMPONENTS = [
  AddNewChildFormComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        SharedModule,
        QuestionsScreenModule,
        ConfirmPersonalUserAddressScreenModule,
        ConfirmPersonalUserSubComponentsModule,
        EpguLibModule.forChild(),
        FormsModule,
    ],
})
export class SubComponentsModule {}
