import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../../../../module-share/shared-components.module';
import { AddNewChildFormComponent } from './add-new-child-form/add-new-child-form.component';

const COMPONENTS = [
  AddNewChildFormComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule
  ]
})
export class SubComponentsModule { }
