import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {NotificationAboutAbsentAccountScreenComponent} from './notification-about-absent-account-screen.component';
import {EpgucSharedModule} from '../../../../shared-module/shared-components.module';

const COMPONENTS = [
  NotificationAboutAbsentAccountScreenComponent
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
export class NotificationAboutAbsentAccountScreenModule { }
