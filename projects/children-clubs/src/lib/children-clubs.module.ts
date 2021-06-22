import { NgModule } from '@angular/core';
import {
  LongButtonModule,
  AppStateModule,
  CoreUiModule,
  AppUiModule,
  AppUiConfig,
  SharedModalModule,
  MainContainerModule,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { Test2Component } from './components/test2/test2.component';

import { GroupListModule } from './components/group-list/group-list.module';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { ProjectGroupComponent } from './components/project-group/project-group.component';
import { ProgramListContainerComponent } from './components/program-list/container/program-list-container.component';

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
    ProjectGroupComponent,
    ChildrenClubsAppComponent,
    ProjectListComponent,
    ProjectViewComponent,
    Test2Component,
  ],
  imports: [
    CoreUiModule,
    MainContainerModule,
    LongButtonModule,
    AppStateModule,
    GroupListModule,
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
    SharedModalModule,
    AppUiModule.forRoot(APP_CONFIG),
    BaseUiModule,
  ],
  exports: [ChildrenClubsAppComponent],
  entryComponents: [ProgramListContainerComponent, Test2Component],
})
export class ChildrenClubsModule {}
