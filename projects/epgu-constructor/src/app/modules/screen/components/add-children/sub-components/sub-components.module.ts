import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewChildFormComponent } from './add-new-child-form/add-new-child-form.component';
import { EpguLibModule } from 'epgu-lib';
import { BirthCertificateComponent } from '../screens/birth-certificate-screen/birth-certificate.component';
import { QuestionScreenModule } from '../../../../questions/question-screen.module';
import {
  ConfirmPersonalUserAddressScreenModule
  // eslint-disable-next-line max-len
} from '../../confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
import {
  SubComponentsModule as ConfirmPersonalUserSubComponentsModule
} from '../../confirm-personal-user/sub-components/sub-components.module';
import {EpgucSharedModule} from '../../../../../shared-module/shared-components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChildRelationshipComponent } from '../../../../questions/components/child-relationship/child-relationship.component';
import { ConfirmChildAddressComponent } from '../screens/confirm-child-address-screen/confirm-child-address.component';

const COMPONENTS = [
  AddNewChildFormComponent,
  BirthCertificateComponent,
  ChildRelationshipComponent,
  ConfirmChildAddressComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    EpgucSharedModule,
    QuestionScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserSubComponentsModule,
    EpguLibModule.forChild(),
  ],
})
export class SubComponentsModule {}
