import { NgModule } from '@angular/core';
import {
  LongButtonModule,
  AppStateModule,
  CoreUiModule,
  AppUiModule,
  AppUiConfig,
  MainContainerModule,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { Test2Component } from './components/test2/test2.component';
import { ProgramListContainerComponent } from './components/program-list/container/program-list-container.component';

const APP_CONFIG: AppUiConfig = {
  appRoutingComponentMap: {
    programList: ProgramListContainerComponent,
    test2: Test2Component,
  },
  appNavigationRuleMap: {
    programList: {
      next: 'test2'
    },
    test2: {}
  }
};

@NgModule({
  declarations: [ChildrenClubsAppComponent, ProjectListComponent, Test2Component],
  imports: [
    CoreUiModule,
    MainContainerModule,
    LongButtonModule,
    AppStateModule,
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
    AppUiModule.forRoot(APP_CONFIG),
    BaseUiModule,
  ],
  exports: [ChildrenClubsAppComponent],
  entryComponents: [
    ProgramListContainerComponent,
    Test2Component
  ]
})
export class ChildrenClubsModule {}
