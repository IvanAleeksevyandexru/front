import { NgModule } from '@angular/core';
import { ChildrenClubsContainerRoutingModule } from './children-clubs-container.routing'
import { ChildrenClubsModule } from '@epgu/children-clubs'
import { ChildrenClubsContainerComponent } from './children-clubs-container.component'

@NgModule({
  declarations: [ChildrenClubsContainerComponent],
  imports: [
    ChildrenClubsModule,
    ChildrenClubsContainerRoutingModule
  ]
})
export class ChildrenClubsContainerModule {
}
