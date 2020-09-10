import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { FpContainerComponent } from './fp-container/fp-container.component'
import { ConfigComponent } from './config/config.component'

const appUrl = environment.appUrl;

const routes: Routes = [
  {
    path: `${appUrl}`,
    component: FpContainerComponent
  },
  {
    path: `${appUrl}config`,
    component: ConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
