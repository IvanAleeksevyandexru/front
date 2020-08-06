import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './component/root/info.component';
import {SharedComponentsModule} from '../../module-share/shared-components.module';
import {EpguLibModule} from 'epgu-lib';

const COMPONENT = [
  InfoComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CommonModule,
    SharedComponentsModule,

    EpguLibModule.forChild(),
  ]
})
export class InfoModule { }
