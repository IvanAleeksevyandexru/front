import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './components/page-name/page-name.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { ScreenPadComponent } from './components/screen-pad/screen-pad.component';
import { ToJsonPipe } from './pipe/toJson/to-json.pipe';
import { LabelComponent } from './components/label/label.component';
import { EpguLibModule } from 'epgu-lib';
import {NavigationService} from './service/navigation/navigation.service';
import {NavigationComponent} from './components/navigation/navigation.component';

const COMPONENTS = [
  // component
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent,
  LabelComponent,
  NavigationComponent,

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
export class SharedModule { }

