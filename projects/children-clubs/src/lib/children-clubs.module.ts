import { NgModule } from '@angular/core';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { EpguCfUiKitModule } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListModule } from '../components/program-list/program-list.module';

@NgModule({
  declarations: [ChildrenClubsAppComponent],
  imports: [EpguCfUiKitModule, ProgramListModule],
  exports: [ChildrenClubsAppComponent],
})
export class ChildrenClubsModule {}
