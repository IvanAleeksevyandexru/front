import { NgModule } from '@angular/core';
import {
  LongButtonModule,
  AppStateModule,
  CoreUiModule,
  AppUiModule,
  AppUiConfig,
} from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ChildrenClubsFilterPanelModule } from './components/filter-panel/children-clubs-filter-panel.module';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { Test1Component } from './components/test1/test1.component';
import { Test2Component } from './components/test2/test2.component';
import { ProjectViewComponent } from './pages/project-view/project-view.component';

const APP_CONFIG: AppUiConfig = {
  appRoutingComponentMap: {
    test1: Test1Component,
    test2: Test2Component,
  },
  appNavigationRuleMap: {
    test1: {
      next: 'test2',
    },
    test2: {},
  },
};

@NgModule({
  declarations: [
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
    ProgramListModule,
    ChildrenClubsFilterPanelModule,
    AppUiModule.forRoot(APP_CONFIG),
  ],
  exports: [ChildrenClubsAppComponent],
  entryComponents: [Test1Component, Test2Component],
})
export class ChildrenClubsModule {}
