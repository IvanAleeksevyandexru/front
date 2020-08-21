import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpgucPageNameComponent } from './components/page-name/epguc-page-name.component';
import { EpgucScreenContainerComponent } from './components/screen-container/epguc-screen-container.component';
import {EpgucScreenPadComponent} from './components/screen-pad/epguc-screen-pad.component';
import { ToJsonPipe } from './pipe/toJson/to-json.pipe';
import { EpguLibModule } from 'epgu-lib';
import {NavigationService} from './service/navigation/navigation.service';
import {NavigationComponent} from './components/navigation/navigation.component';
import {EpgucLabelComponent} from './components/label/epguc-label.component';

const COMPONENTS = [
  // component
  EpgucPageNameComponent,
  EpgucScreenContainerComponent,
  EpgucScreenPadComponent,
  NavigationComponent,
  EpgucLabelComponent,

  // Pipe
  ToJsonPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [NavigationService],
  exports: [...COMPONENTS],
    imports: [
        CommonModule,
        EpguLibModule,
    ]
})
export class EpgucSharedModule { }

