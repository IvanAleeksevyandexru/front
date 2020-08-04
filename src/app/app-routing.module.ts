import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'showcase', pathMatch: 'full'  },
  { path: '**', redirectTo: 'showcase', },

  {
    path: 'showcase',
    loadChildren: () =>
      import('../constructor/constructor.module').then(
        m => m.ConstructorModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
