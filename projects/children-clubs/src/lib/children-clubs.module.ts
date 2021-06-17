import { NgModule } from '@angular/core';
import {
  LongButtonModule,
  AppStateModule,
  CoreUiModule,
  AppUiModule,
  AppUiConfig,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { Test1Component } from './components/test1/test1.component';
import { Test2Component } from './components/test2/test2.component';
import { ProjectViewComponent } from './pages/project-view/project-view.component';
import { BackComponent } from './components/back/back.component';
import { ProjectGroupComponent } from './pages/project-group/project-group.component';
import { GroupListModule } from './components/group-list/group-list.module';

const APP_CONFIG: AppUiConfig = {
  appRoutingComponentMap: {
    projectList: ProjectListComponent,
    projectView: ProjectViewComponent,
    projectGroup: ProjectGroupComponent,
  },
  appNavigationRuleMap: {
    projectList: {
      next: 'projectView',
    },
    projectView: { next: 'projectGroup' },
    projectGroup: {},
  },
};

@NgModule({
  declarations: [
    BackComponent,
    ProjectGroupComponent,
    ChildrenClubsAppComponent,
    ProjectListComponent,
    ProjectViewComponent,
    Test1Component,
    Test2Component,
  ],
  imports: [
    CoreUiModule,
    LongButtonModule,
    AppStateModule,
    GroupListModule,
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
    SharedModalModule,
    AppUiModule.forRoot(APP_CONFIG),
  ],
  exports: [ChildrenClubsAppComponent],
  entryComponents: [Test1Component, Test2Component],
})
export class ChildrenClubsModule {}
