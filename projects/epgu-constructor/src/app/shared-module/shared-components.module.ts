import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpgucPageNameComponent } from './components/page-name/epguc-page-name.component';
import { EpgucScreenContainerComponent } from './components/screen-container/epguc-screen-container.component';
import {EpgucScreenPadComponent} from './components/screen-pad/epguc-screen-pad.component';
import { ToJsonPipe } from './pipe/toJson/to-json.pipe';
import {NavigationService} from './service/navigation/navigation.service';
import {NavigationComponent} from './components/navigation/navigation.component';

const COMPONENTS = [
  // component
  EpgucPageNameComponent,
  EpgucScreenContainerComponent,
  EpgucScreenPadComponent,
  NavigationComponent,

  // Pipe
  ToJsonPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [NavigationService],
  exports: [...COMPONENTS],
  imports: [
    CommonModule
  ]
})
export class EpgucSharedModule { }

