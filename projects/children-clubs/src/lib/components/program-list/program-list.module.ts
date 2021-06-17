import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import {
  LongButtonModule,
  ModalService,
  ScreenPadModule,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListContainerComponent } from './container/program-list-container.component';
import { ProgramListService } from './program-list.service';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { ViewComponent } from './components/view/view.component';
import { ChildrenClubsFilterPanelModule } from '../filter-panel/children-clubs-filter-panel.module';

@NgModule({
  declarations: [ProgramListContainerComponent, ListComponent, ItemComponent, ViewComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    LongButtonModule,
    SharedModalModule,
    ScreenPadModule,
    ChildrenClubsFilterPanelModule,
  ],

  providers: [ProgramListService, ModalService],
  exports: [ProgramListContainerComponent, ViewComponent],
})
export class ProgramListModule {}
