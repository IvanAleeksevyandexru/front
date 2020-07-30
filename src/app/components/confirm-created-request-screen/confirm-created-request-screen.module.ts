import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {EpguLibModule} from 'epgu-lib';
import {ConfirmCreatedRequestScreenComponent} from './confirm-created-request-screen.component';

const COMPONENTS = [
  ConfirmCreatedRequestScreenComponent
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
export class ConfirmCreatedRequestScreenModule { }
