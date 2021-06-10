import { NgModule } from '@angular/core';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
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
