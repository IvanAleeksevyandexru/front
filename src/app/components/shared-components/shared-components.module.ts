import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './page-name/page-name.component';
import { ScreenContainerComponent } from './screen-container/screen-container.component';
import { AppCardComponent } from './app-card/app-card.component';

const COMPONENTS = [
  PageNameComponent,
  ScreenContainerComponent,
  AppCardComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule
  ]
})
export class SharedComponentsModule { }
