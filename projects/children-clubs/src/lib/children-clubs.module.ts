import { NgModule } from '@angular/core';
import { EpguCfUiKitModule, AppStateModule } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';

@NgModule({
  declarations: [ChildrenClubsAppComponent],
  imports: [
    EpguCfUiKitModule,
    AppStateModule,
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
  ],
  exports: [ChildrenClubsAppComponent],
})
export class ChildrenClubsModule {}
