import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpgucPageNameComponent } from './components/page-name/epguc-page-name.component';
import { EpgucScreenContainerComponent } from './components/screen-container/epguc-screen-container.component';
import {EpgucScreenPadComponent} from './components/screen-pad/epguc-screen-pad.component';
import { ToJsonPipe } from './pipe/toJson/to-json.pipe';
import { EpgucLabelComponent } from './components/label/epguc-label.component';
import { EpguLibModule } from 'epgu-lib';

const COMPONENTS = [
  // component
  EpgucPageNameComponent,
  EpgucScreenContainerComponent,
  EpgucScreenPadComponent,
  EpgucLabelComponent,
  // Pipe
  ToJsonPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
    imports: [
        CommonModule,
        EpguLibModule
    ]
})
export class EpgucSharedModule { }

