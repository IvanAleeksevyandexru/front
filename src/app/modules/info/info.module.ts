import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './component/root/info.component';
import {SharedComponentsModule} from '../../module-share/shared-components.module';
import {EpguLibModule} from 'epgu-lib';
import {WelcomeBlockModule} from './component/welcome-block/screens/welcome-block-screen/welcome-block.module';
import {RequirementsListModule} from './component/requirements-list-screen/requirements-list.module';

const COMPONENT = [
  InfoComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CommonModule,
    SharedComponentsModule,

    WelcomeBlockModule,
    RequirementsListModule,

    EpguLibModule.forChild(),
  ]
})
export class InfoModule { }
