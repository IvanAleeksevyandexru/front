import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './components/page-name/page-name.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import {ScreenPadComponent} from './components/screen-pad/screen-pad.component';
import { ToJsonPipe } from './pipe/to-json.pipe';

const COMPONENTS = [
  // component
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent,

  // Pipe
  ToJsonPipe
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule
  ]
})
export class SharedComponentsModule { }
