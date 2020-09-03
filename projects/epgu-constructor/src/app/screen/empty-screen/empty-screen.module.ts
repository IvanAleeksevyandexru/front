import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';
import { RedirectComponent } from './components/redirect.component';

@NgModule({
	declarations: [
	  EmptyScreenComponent,
    RedirectComponent
  ],
	exports: [
	  EmptyScreenComponent
  ],
	imports: [
		CommonModule,
	],
})
export class EmptyScreenModule { }
