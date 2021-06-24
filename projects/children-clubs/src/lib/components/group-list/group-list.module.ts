import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import {
  LongButtonModule,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';

import { GroupListComponent } from './components/group-list/group-list.component';
import { BaseModule } from '../base/base.module';

@NgModule({
  declarations: [GroupListComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    LongButtonModule,
    ScreenPadModule,
    BaseModule,
    ScreenContainerModule,
  ],

  providers: [],
  exports: [GroupListComponent],
})
export class GroupListModule {}
