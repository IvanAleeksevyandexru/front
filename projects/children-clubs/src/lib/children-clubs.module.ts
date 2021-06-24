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
  HEALTH_SERVICE,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from './components/base/base.module';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ProjectListComponent } from './components/project-list/project-list.component';

import { GroupListModule } from './components/group-list/group-list.module';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { ProjectGroupComponent } from './components/project-group/project-group.component';
import { ProgramListContainerComponent } from './components/program-list/container/program-list-container.component';
import { HealthHandlerService } from './services/health/health-handler.service';

const APP_CONFIG: AppUiConfig = {
  appRoutingComponentMap: {
    projectList: ProjectListComponent,
    projectView: ProjectViewComponent,
    projectGroup: ProjectGroupComponent,
  },
  appNavigationRuleMap: {
    projectList: { next: 'projectView' },
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
  ],
  imports: [
    CoreUiModule,
    MainContainerModule,
    LongButtonModule,
    AppStateModule,
    GroupListModule,
    ProgramListModule,
    BaseModule,
    SharedModalModule,
    AppUiModule.forRoot(APP_CONFIG),
    BaseUiModule,
  ],
  providers: [
    {
      provide: HEALTH_SERVICE,
      useClass: HealthHandlerService,
    },
  ],
  exports: [ChildrenClubsAppComponent],
  entryComponents: [ProgramListContainerComponent],
})
export class ChildrenClubsModule {}
