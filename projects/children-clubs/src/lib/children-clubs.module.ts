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
  TRACE_ALLOWED_REMOTE_SERVICES,
  ERROR_HANDLER_SERVICE,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from './components/base/base.module';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';

import { GroupListModule } from './components/group-list/group-list.module';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { ProjectGroupComponent } from './components/project-group/project-group.component';
import { HealthHandlerService } from './services/health/health-handler.service';
import {
  DIRECTIONS_SUB_URL,
  MUNICIPALITIES_SUB_URL,
  PROGRAM_DETAIL_SUB_URL,
  REGIONS_SUB_URL,
  SEARCH_GROUP_SUB_URL,
  SEARCH_PROGRAM_SUB_URL,
} from './services/health/health-handler';
import { ErrorHandlerService } from './services/error-handler/error-handler.service';

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
    SelectMapObjectModule,
    AppUiModule.forRoot(APP_CONFIG),
    BaseUiModule,
  ],
  providers: [
    {
      provide: HEALTH_SERVICE,
      useClass: HealthHandlerService,
    },
    {
      provide: TRACE_ALLOWED_REMOTE_SERVICES,
      useValue: [
        REGIONS_SUB_URL,
        SEARCH_GROUP_SUB_URL,
        SEARCH_PROGRAM_SUB_URL,
        PROGRAM_DETAIL_SUB_URL,
        MUNICIPALITIES_SUB_URL,
        DIRECTIONS_SUB_URL,
      ],
    },
    {
      provide: ERROR_HANDLER_SERVICE,
      useClass: ErrorHandlerService,
    },
  ],
  exports: [ChildrenClubsAppComponent],
  entryComponents: [
    ProjectGroupComponent,
    ChildrenClubsAppComponent,
    ProjectListComponent,
    ProjectViewComponent,
  ],
})
export class ChildrenClubsModule {}
