import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalBaseComponent } from './components/confirmation-modal/confirmation-modal-base/confirmation-modal-base.component';
import { CommonModalComponent } from './components/common-modal/common-modal.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { ModalBaseComponent } from './components/modal-base/modal-base.component';
import { UsePaymentsModalComponent } from './components/use-payment-modal/use-payment-modal/use-payments-modal.component';
import { ModalService } from './modal.service';

const COMPONENTS = [
  ConfirmationModalComponent,
  ConfirmationModalBaseComponent,
  CommonModalComponent,
  ModalContainerComponent,
  ModalBaseComponent,
  UsePaymentsModalComponent,
];

/**
 * Домен модал. Тут храним что необходимо для модалок.
 */
@NgModule({
  declarations: [...COMPONENTS],
  providers: [
    ModalService,
  ],
  exports: [...COMPONENTS],
  imports: [CoreModule],
  entryComponents: [
    ModalBaseComponent,
    ModalContainerComponent,
    ConfirmationModalComponent,
    CommonModalComponent,
    UsePaymentsModalComponent,
  ],
})
export class ModalModule {}
