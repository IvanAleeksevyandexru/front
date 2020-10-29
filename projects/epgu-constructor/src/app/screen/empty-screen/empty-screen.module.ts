import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';
import { EmptyScreenComponentsModule } from '../../component/empty-screen/empty-screen-components.module';

@NgModule({
	declarations: [
	  EmptyScreenComponent
  ],
	exports: [
	  EmptyScreenComponent
  ],
	imports: [
		CommonModule,
    EmptyScreenComponentsModule
	],
})
export class EmptyScreenModule { }
