import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClubsComponent } from './clubs.component';

const routes: Routes = [
  {
    path: '',
    component: ClubsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubsRoutingModule {}
