import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConfirmCreatedRequestScreenComponent} from './confirm-created-request-screen.component';
import {EpgucSharedModule} from '@epgu-constructor';

const COMPONENTS = [
  ConfirmCreatedRequestScreenComponent
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
export class ConfirmCreatedRequestScreenModule { }
