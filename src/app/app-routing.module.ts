import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'showcase', pathMatch: 'full'  },
  { path: '**', redirectTo: 'showcase', },

  {
    path: 'showcase',
    loadChildren: () =>
      import('../showcase/containers/showcase-index-page/showcase-index-page.module').then(
        m => m.ShowcaseIndexPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
