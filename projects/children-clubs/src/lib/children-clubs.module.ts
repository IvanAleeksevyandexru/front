import { NgModule } from '@angular/core';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { EpguCfUiKitModule } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListModule } from '../components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';

@NgModule({
  declarations: [ChildrenClubsAppComponent],
  imports: [EpguCfUiKitModule, ProgramListModule, ChildrenClubsFilterPanelModule],
  exports: [ChildrenClubsAppComponent],
})
export class ChildrenClubsModule {}
