import { NgModule } from '@angular/core';
import { ModalService } from '../modal.service';
import { UsePaymentsModalComponent } from './use-payments-modal.component';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [UsePaymentsModalComponent],
  providers: [
    ModalService,
  ],
  exports: [UsePaymentsModalComponent],
  imports: [BaseModule],
  entryComponents: [
    UsePaymentsModalComponent
  ],
})
export class UsePaymentsModalModule {}
