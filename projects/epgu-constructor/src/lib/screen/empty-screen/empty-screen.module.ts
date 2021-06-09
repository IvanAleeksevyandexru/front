import { NgModule } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';
import { EmptyScreenComponentsModule } from '../../component/empty-screen/empty-screen-components.module';
import { BaseModule } from '../../shared/base.module';

@NgModule({
	declarations: [
	  EmptyScreenComponent
  ],
	exports: [
	  EmptyScreenComponent
  ],
	imports: [
    BaseModule,
    EmptyScreenComponentsModule
	],
})
export class EmptyScreenModule {}
