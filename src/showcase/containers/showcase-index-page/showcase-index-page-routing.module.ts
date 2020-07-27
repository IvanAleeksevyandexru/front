import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowcaseIndexPageComponent } from './showcase-index-page/showcase-index-page.component';


const routes: Routes = [
  { path: '', component: ShowcaseIndexPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowcaseIndexPageRoutingModule { }
