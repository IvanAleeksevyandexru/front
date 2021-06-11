import { NgModule } from '@angular/core';
import { LongButtonModule, AppStateModule, CoreUiModule, SharedModalModule } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProgramFiltersModule } from './components/program-filters/program-filters.module';

@NgModule({
  declarations: [ChildrenClubsAppComponent, ProjectListComponent],
  imports: [
    CoreUiModule,
    LongButtonModule,
    AppStateModule,
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
    ProgramFiltersModule,
    SharedModalModule,
  ],

  exports: [ChildrenClubsAppComponent],
})
export class ChildrenClubsModule {}
