import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../../../../module-share/shared-components.module';
import { AddNewChildFormComponent } from './add-new-child-form/add-new-child-form.component';
import { EpguLibModule } from 'epgu-lib';
import { BirthCertificateComponent } from './birth-certificate/birth-certificate.component';
import { ChildRelationshipComponent } from './child-relationship/child-relationship.component';
import { QuestionScreenModule } from '../../../../questions/question-screen.module';
import { ConfirmChildAddressComponent } from './confirm-child-address/confirm-child-address.component';
import {
  ConfirmPersonalUserAddressScreenModule
// eslint-disable-next-line max-len
} from '../../../../screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
import {
  SubComponentsModule as ConfirmPersonalUserSubComponentsModule
} from '../../../../screen/components/confirm-personal-user/sub-components/sub-components.module';

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
    SharedComponentsModule,
    QuestionScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserSubComponentsModule,
    EpguLibModule.forChild(),
  ],
})
export class SubComponentsModule {}
