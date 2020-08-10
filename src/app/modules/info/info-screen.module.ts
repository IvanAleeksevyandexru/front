import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoScreenComponent } from './component/root/info-screen.component';
import {EpgucSharedModule} from '@epgu-constructor';
import {EpguLibModule} from 'epgu-lib';
import {WelcomeBlockModule} from './component/welcome-block/screens/welcome-block-screen/welcome-block.module';
import {RequirementsListModule} from './component/requirements-list-screen/requirements-list.module';

const COMPONENT = [
  InfoScreenComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CommonModule,
    EpgucSharedModule,

    WelcomeBlockModule,
    RequirementsListModule,

    EpguLibModule.forChild(),
  ]
})
export class InfoScreenModule { }
