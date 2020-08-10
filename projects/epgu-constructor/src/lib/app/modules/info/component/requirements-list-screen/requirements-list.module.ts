import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RequirementsListComponent} from './requirements-list.component';
import {EpguLibModule} from 'epgu-lib';
import {EpgucSharedModule} from '../../../../shared-module/shared-components.module';

const COMPONENTS = [
  RequirementsListComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class RequirementsListModule { }

