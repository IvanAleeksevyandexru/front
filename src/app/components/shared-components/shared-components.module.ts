import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './page-name/page-name.component';
import { ScreenContainerComponent } from './screen-container/screen-container.component';
import { ScreenPadComponent } from './screen-pad/screen-pad.component';

const COMPONENTS = [
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule
  ]
})
export class SharedComponentsModule { }
