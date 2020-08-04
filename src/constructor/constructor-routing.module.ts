import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ConstructorComponent } from './constructor.component';

const routes: Routes = [
  {
    path: '',
    component: ConstructorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConstructorComponentRoutingModule {}