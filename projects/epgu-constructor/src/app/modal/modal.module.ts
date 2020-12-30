import { NgModule } from '@angular/core';
import { ModalService } from './modal.service';
import { ConfirmationModalModule } from './confirmation-modal/confirmation-modal.module';
import { UsePaymentsModalModule } from './use-payment-modal/use-payments-modal.module';
import { SharedModalModule } from './shared/shared-modal.module';
import { ScreenModalModule } from './screen-modal/screen-modal.module';
import { ContinueOrderModalService } from './continue-order-modal/continue-order-modal.service';
import { BaseModule } from '../shared/base.module';


/**
 * Домен модал. Тут храним что необходимо для модалок.
 */
@NgModule({
  providers: [
    ModalService,
    ContinueOrderModalService,
  ],
  imports: [
    BaseModule,
    SharedModalModule,
    ConfirmationModalModule,
    UsePaymentsModalModule,
    ScreenModalModule
  ],
  exports: [
    SharedModalModule,
    ConfirmationModalModule,
    UsePaymentsModalModule,
    ScreenModalModule
  ]
})
export class ModalModule {}
