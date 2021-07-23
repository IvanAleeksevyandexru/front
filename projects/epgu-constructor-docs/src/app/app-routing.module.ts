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
  {
    path: 'components/helper-text',
    loadChildren: () =>
      import('../components/helper-text/helper-text.module').then(
        (m) => m.ExampleEpguHelperTextModule,
      ),
    data: {
      title: 'HelperText',
    },
  },
  {
    path: 'components/checkbox',
    loadChildren: () =>
      import('../components/checkbox/checkbox.module').then((m) => m.ExampleEpguCheckboxModule),
    data: {
      title: 'Checkbox',
    },
  },
  {
    path: 'components/long-button',
    loadChildren: () =>
      import('../components/long-button/long-button.module').then(
        (m) => m.ExampleEpguLongButtonModule,
      ),
    data: {
      title: 'LongText',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
