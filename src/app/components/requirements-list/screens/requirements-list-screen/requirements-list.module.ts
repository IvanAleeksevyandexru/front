import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedComponentsModule} from '../../../shared-components/shared-components.module';
import {RequirementsListComponent} from './requirements-list.component';
import {EpguLibModule} from 'epgu-lib';

const COMPONENTS = [
  RequirementsListComponent
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
export class RequirementsListModule { }

