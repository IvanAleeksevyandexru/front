import { NgModule } from '@angular/core';
import { EpguCfUiKitModule, AppStateModule } from '@epgu/epgu-constructor-ui-kit';

import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { ProgramListModule } from './components/program-list/program-list.module';
import { ProgramFiltersModule } from './components/program-filters/program-filters.module';

@NgModule({
  declarations: [ChildrenClubsAppComponent],
  imports: [EpguCfUiKitModule, ProgramListModule, AppStateModule, ProgramFiltersModule],
  exports: [ChildrenClubsAppComponent],
})
export class ChildrenClubsModule {}
