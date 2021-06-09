import { NgModule } from '@angular/core';
import {
  SharedModalModule,
  ModalService,
} from '@epgu/epgu-constructor-ui-kit';

import { UsePaymentsModalModule } from './use-payment-modal/use-payments-modal.module';
import { ScreenModalModule } from './screen-modal/screen-modal.module';
import { ContinueOrderModalService } from './continue-order-modal/continue-order-modal.service';
import { BaseModule } from '../shared/base.module';
import { DropdownListModalModule } from './dropdown-list-modal/dropdown-list-modal.module';
import { AttachUploadedFilesModalModule } from './attach-uploaded-files-modal/attach-uploaded-files-modal.module';
import { ModalErrorService } from './modal-error.service';
import { ConfirmationModalModule } from './confirmation-modal/confirmation-modal.module';

/**
 * Домен модал. Тут храним что необходимо для модалок.
 */
@NgModule({
  providers: [
    ModalService,
    ContinueOrderModalService,
    ModalErrorService,
  ],
  imports: [
    BaseModule,
    SharedModalModule,
    ConfirmationModalModule,
    UsePaymentsModalModule,
    ScreenModalModule,
    DropdownListModalModule,
    AttachUploadedFilesModalModule,
  ],
  exports: [
    SharedModalModule,
    ConfirmationModalModule,
    UsePaymentsModalModule,
    ScreenModalModule,
    DropdownListModalModule,
    AttachUploadedFilesModalModule,
  ]
})
export class ModalModule {}
