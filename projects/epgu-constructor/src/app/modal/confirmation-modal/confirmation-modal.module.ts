import { NgModule } from '@angular/core';
import { ModalService } from '../modal.service';
import { ConfirmationModalBaseComponent } from './confirmation-modal-base/confirmation-modal-base.component';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    ConfirmationModalBaseComponent
  ],
  providers: [
    ModalService,
  ],
  exports: [
    ConfirmationModalComponent,
    ConfirmationModalBaseComponent
  ],
  imports: [BaseModule],
  entryComponents: [
    ConfirmationModalComponent,
    ConfirmationModalBaseComponent
  ],
})
export class ConfirmationModalModule {}
