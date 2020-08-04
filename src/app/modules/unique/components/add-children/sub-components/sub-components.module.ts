import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../../../../module-share/shared-components.module';
import { AddNewChildFormComponent } from './add-new-child-form/add-new-child-form.component';
import {EpguLibModule} from 'epgu-lib';
import { BirthCertificateComponent } from './birth-certificate/birth-certificate.component';
import { ChildRelationshipComponent } from './child-relationship/child-relationship.component';

const COMPONENTS = [
  AddNewChildFormComponent,
  BirthCertificateComponent,
  ChildRelationshipComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class SubComponentsModule { }
