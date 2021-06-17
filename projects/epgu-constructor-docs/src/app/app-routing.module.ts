import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'components/chip',
    loadChildren: () =>
      import('../components/chip/chip.module').then((m) => m.ExampleEpguChipModule),
    data: {
      title: 'Chip',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
