import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyComponent } from './components/root/empty.component';
import { RedirectComponent } from './components/redirect.component';

const COMPONENTS = [
	EmptyComponent,
	RedirectComponent,
];

@NgModule({
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS],
	imports: [
		CommonModule,
	],
})
export class EmptyModule { }
