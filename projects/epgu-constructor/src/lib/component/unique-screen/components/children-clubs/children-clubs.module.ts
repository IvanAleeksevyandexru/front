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
import { SelectMapObjectCcModule } from './components/select-map-object/select-map-object.module';
import { GroupListModule } from './components/group-list/group-list.module';

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
    SelectMapObjectCcModule,
    NotifierModule,
  ],
})
export class ChildrenClubsModule {}
