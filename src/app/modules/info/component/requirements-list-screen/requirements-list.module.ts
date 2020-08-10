import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EpgucSharedModule} from '@epgu-constructor';
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
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class RequirementsListModule { }

