import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './components/page-name/page-name.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { AppCardComponent } from './components/app-card/app-card.component';

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
export class SharedModule { }
