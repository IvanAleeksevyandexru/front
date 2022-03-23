import { NgModule } from '@angular/core';
import {
  LongButtonModule,
  MicroAppStateModule,
  CoreUiModule,
  SharedModalModule,
  MainContainerModule,
} from '@epgu/epgu-constructor-ui-kit';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { BaseModule } from './components/base/base.module';
import { ProgramListModule } from './components/program-list/program-list.module';
import { GroupListModule } from './components/group-list/group-list.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DisplayProjectListInterceptor } from './interceptors/display-project-list/display-project-list.interceptor';

@NgModule({
  imports: [
    CoreUiModule,
    MainContainerModule,
    LongButtonModule,
    MicroAppStateModule,
    GroupListModule,
    ProgramListModule,
    BaseModule,
    SharedModalModule,
    NotifierModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DisplayProjectListInterceptor,
      multi: true,
    },
  ],
})
export class ChildrenClubsModule {}
