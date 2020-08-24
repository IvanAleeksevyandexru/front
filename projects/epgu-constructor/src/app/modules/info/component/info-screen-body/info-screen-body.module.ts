import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoScreenBodyComponent } from './info-screen-body.component';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared-module/shared-components.module';

const COMPONENTS = [
  InfoScreenBodyComponent
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
export class InfoScreenBodyModule { }

