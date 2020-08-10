import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoScreenComponent } from './component/root/info-screen.component';
import {EpguLibModule} from 'epgu-lib';
import {InfoScreenBodyModule} from './component/info-screen-body/info-screen-body.module';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';

const COMPONENT = [
  InfoScreenComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CommonModule,
    EpgucSharedModule,

    InfoScreenBodyModule,

    EpguLibModule.forChild(),
  ]
})
export class InfoScreenModule { }
