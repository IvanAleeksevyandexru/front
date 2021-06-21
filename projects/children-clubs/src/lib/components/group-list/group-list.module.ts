import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import {
  LongButtonModule,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsFilterPanelModule } from '../filter-panel/children-clubs-filter-panel.module';

import { GroupListComponent } from './components/group-list/group-list.component';

@NgModule({
  declarations: [GroupListComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    LongButtonModule,
    ScreenPadModule,
    ChildrenClubsFilterPanelModule,
    ScreenContainerModule,
  ],

  providers: [],
  exports: [GroupListComponent],
})
export class GroupListModule {}
