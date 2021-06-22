import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import {
  LongButtonModule,
  ModalService,
  ScreenPadModule,
  SharedModalModule,
  ScreenContainerModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListContainerComponent } from './container/program-list-container.component';
import { ProgramListService } from './program-list.service';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { ViewComponent } from './components/view/view.component';
import { ChildrenClubsFilterPanelModule } from '../filter-panel/children-clubs-filter-panel.module';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';
import { ContentModalComponent } from './components/content-modal/content-modal.component';
import { ProgramFiltersModule } from '../program-filters/program-filters.module';

@NgModule({
  declarations: [
    ProgramListContainerComponent,
    ListComponent,
    ItemComponent,
    ViewComponent,
    ContentModalComponent,
  ],
  imports: [
    ProgramFiltersModule,
    CommonModule,
    EpguLibModule,
    LongButtonModule,
    SharedModalModule,
    ScreenPadModule,
    ChildrenClubsFilterPanelModule,
    ScreenContainerModule,
  ],
  entryComponents: [ContentModalComponent],

  providers: [ProgramListService, ModalService, { provide: ApiService, useClass: ApiServiceStub }],
  exports: [ProgramListContainerComponent, ViewComponent],
})
export class ProgramListModule {}
