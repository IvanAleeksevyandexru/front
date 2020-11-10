import { NgModule } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';
import { EmptyScreenComponentsModule } from '../../component/empty-screen/empty-screen-components.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
	declarations: [
	  EmptyScreenComponent
  ],
	exports: [
	  EmptyScreenComponent
  ],
	imports: [
		CoreModule,
    EmptyScreenComponentsModule
	],
})
export class EmptyScreenModule { }
