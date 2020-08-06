import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {SharedComponentsModule} from '../../../../module-share/shared-components.module';
import {NotificationAboutAbsentAccountScreenComponent} from './notification-about-absent-account-screen.component';

const COMPONENTS = [
  NotificationAboutAbsentAccountScreenComponent
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
export class NotificationAboutAbsentAccountScreenModule { }
