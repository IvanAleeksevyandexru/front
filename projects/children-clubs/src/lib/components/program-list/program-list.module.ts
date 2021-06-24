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
import { ProgramFiltersModule } from '../program-filters/program-filters.module';
import { StateService } from '../../services/state/state.service';
import { StateServiceStub } from '../../services/state/state.service.stub';

@NgModule({
  declarations: [ProgramListContainerComponent, ListComponent, ItemComponent, ViewComponent],
  imports: [
    ProgramFiltersModule,
    CommonModule,
    LongButtonModule,
    SharedModalModule,
    ScreenPadModule,
    ChildrenClubsFilterPanelModule,
    ScreenContainerModule,
    EpguLibModule,
  ],

  providers: [
    ProgramListService,
    ModalService,
    { provide: ApiService, useClass: ApiServiceStub },
    { provide: StateService, useClass: StateServiceStub },
  ],
  exports: [ProgramListContainerComponent, ViewComponent],
})
export class ProgramListModule {}
