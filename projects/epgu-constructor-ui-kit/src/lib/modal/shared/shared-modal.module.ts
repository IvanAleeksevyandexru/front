import { NgModule } from '@angular/core';
import { CommonModalComponent } from './common-modal/common-modal.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { ModalBaseComponent } from './modal-base/modal-base.component';
import { BaseUiModule } from '../../base/base-ui.module';
import { CtaModalComponent } from './cta-modal/cta-modal.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    CommonModalComponent,
    ModalContainerComponent,
    ModalBaseComponent,
    CtaModalComponent,
  ],
  exports: [CommonModalComponent, ModalContainerComponent, ModalBaseComponent, CtaModalComponent],
  imports: [BaseUiModule, A11yModule],
  entryComponents: [
    ModalBaseComponent,
    ModalContainerComponent,
    CommonModalComponent,
    CtaModalComponent,
  ],
})
export class SharedModalModule {}
