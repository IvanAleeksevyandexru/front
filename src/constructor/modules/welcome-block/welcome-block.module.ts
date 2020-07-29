import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {WelcomeBlockComponent} from './welcome-block.component';
import {EpguLibModule} from 'epgu-lib';

const COMPONENTS = [
  WelcomeBlockComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule.forChild(),
  ]
})
export class WelcomeBlockModule { }
