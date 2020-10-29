import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RedirectComponent } from './components/redirect.component';

@NgModule({
	declarations: [
    RedirectComponent
  ],
	exports: [
    RedirectComponent
  ],
	imports: [
		CommonModule,
	],
})
export class EmptyScreenComponentsModule {}
