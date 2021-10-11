import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildrenClubsContainerComponent } from './children-clubs-container.component';

const routes: Routes = [
  {
    path: '',
    component: ChildrenClubsContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildrenClubsContainerRoutingModule {}
