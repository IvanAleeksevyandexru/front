import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared-module/shared-components.module';
import { InfoScreenBodyModule } from './component/info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './component/root/info-screen.component';

const COMPONENT = [
  InfoScreenComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CommonModule,
    SharedModule,

    InfoScreenBodyModule,

    EpguLibModule.forChild(),
  ],
})
export class InfoScreenModule { }
