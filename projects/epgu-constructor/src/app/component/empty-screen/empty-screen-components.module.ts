import { NgModule } from '@angular/core';
import { RedirectComponent } from './components/redirect.component';
import { ModalModule } from '../../modal/modal.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
	declarations: [
    RedirectComponent
  ],
	exports: [
    RedirectComponent
  ],
	imports: [
		CoreModule,
    ModalModule
	],
})
export class EmptyScreenComponentsModule {}
