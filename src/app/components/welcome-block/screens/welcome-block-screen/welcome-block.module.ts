import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedComponentsModule} from '../../../shared-components/shared-components.module';
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
    SharedComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class WelcomeBlockModule { }
