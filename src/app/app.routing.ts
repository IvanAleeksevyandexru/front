import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FpContainerComponent } from './fp-container/fp-container.component'
import { ConfigComponent } from './config/config.component'


const routes: Routes = [
  {
    path: '',
    component: FpContainerComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
