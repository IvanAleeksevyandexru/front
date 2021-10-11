import { NgModule } from '@angular/core';
import { RedirectComponent } from './components/redirect.component';
import { ModalModule } from '../../modal/modal.module';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [RedirectComponent],
  exports: [RedirectComponent],
  imports: [BaseModule, ModalModule],
})
export class EmptyScreenComponentsModule {}
