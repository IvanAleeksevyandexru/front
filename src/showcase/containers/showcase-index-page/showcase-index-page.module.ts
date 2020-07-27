import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseIndexPageRoutingModule } from './showcase-index-page-routing.module';
import { ShowcaseIndexPageComponent } from './showcase-index-page/showcase-index-page.component';

import { ShowBtnModule } from '../../components/show-btn/show-btn.module';


@NgModule({
  declarations: [ShowcaseIndexPageComponent],
  imports: [
    CommonModule,
    ShowcaseIndexPageRoutingModule,
    ShowBtnModule,
  ]
})
export class ShowcaseIndexPageModule { }
