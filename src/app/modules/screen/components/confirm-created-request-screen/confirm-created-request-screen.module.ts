import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConfirmCreatedRequestScreenComponent} from './confirm-created-request-screen.component';
import {SharedComponentsModule} from '../../../../module-share/shared-components.module';

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
