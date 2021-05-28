import { NgModule } from '@angular/core';
import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { EpguCfUiKitModule } from '@epgu/epgu-constructor-ui-kit';



@NgModule({
  declarations: [ChildrenClubsAppComponent],
  imports: [EpguCfUiKitModule],
  exports: [ChildrenClubsAppComponent]
})
export class ChildrenClubsModule { }
