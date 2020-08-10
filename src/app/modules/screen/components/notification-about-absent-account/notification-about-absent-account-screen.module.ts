import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {EpgucSharedModule} from '@epgu-constructor';
import {NotificationAboutAbsentAccountScreenComponent} from './notification-about-absent-account-screen.component';

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
