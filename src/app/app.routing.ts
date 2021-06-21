import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigComponent } from './config/config.component'


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./fp-container/fp-container.module').then(m => m.FpContainerModule)
  },
  {
    path: 'config',
    component: ConfigComponent
  },
  {
    path: 'app/children-clubs',
    loadChildren: () => import('./children-clubs-container/children-clubs-container.module').then(m => m.ChildrenClubsContainerModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
