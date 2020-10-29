import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { InfoScreenBodyModule } from './info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './info-screen.component';

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
    EpguLibModule,
  ],
  providers: []
})
export class InfoScreenModule { }
