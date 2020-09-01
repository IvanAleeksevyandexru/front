import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyComponent } from './components/root/empty.component';
import { RedirectComponent } from './components/redirect.component';

@NgModule({
	declarations: [
	  EmptyComponent,
    RedirectComponent
  ],
	exports: [
	  EmptyComponent
  ],
	imports: [
		CommonModule,
	],
})
export class EmptyModule { }
