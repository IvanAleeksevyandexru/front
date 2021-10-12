import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FpContainerComponent } from './fp-container.component';

const routes: Routes = [
  {
    path: '',
    component: FpContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FpRoutingModule {}
