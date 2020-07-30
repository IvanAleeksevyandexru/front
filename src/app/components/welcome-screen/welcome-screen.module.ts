import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {WelcomeScreenComponent} from './welcome-screen.component';
import {EpguLibModule} from 'epgu-lib';

const COMPONENTS = [
  WelcomeScreenComponent
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
export class WelcomeScreenModule { }
