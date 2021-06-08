import { NgModule } from '@angular/core';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsFilterPanelComponent } from './children-clubs-filter-panel.component';

@NgModule({
  declarations: [ChildrenClubsFilterPanelComponent],
  imports: [ScreenPadModule, EpguLibModule],
  exports: [ChildrenClubsFilterPanelComponent]
})
export class ChildrenClubsFilterPanelModule { }
