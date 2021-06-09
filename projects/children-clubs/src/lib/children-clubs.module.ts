import { NgModule } from '@angular/core';
import { LongButtonModule, AppStateModule, CoreUiModule } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';
import { ProjectListComponent } from './pages/project-list/project-list.component';

@NgModule({
  declarations: [ChildrenClubsAppComponent, ProjectListComponent],
  imports: [
    CoreUiModule,
    LongButtonModule,
    AppStateModule,
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
  ],

  exports: [ChildrenClubsAppComponent],
})
export class ChildrenClubsModule {}
