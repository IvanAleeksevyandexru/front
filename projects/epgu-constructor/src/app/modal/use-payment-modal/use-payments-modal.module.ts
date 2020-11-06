import { NgModule } from '@angular/core';
import { ModalService } from '../modal.service';
import { CoreModule } from '../../core/core.module';
import { UsePaymentsModalComponent } from './use-payments-modal.component';


const COMPONENTS = [
  UsePaymentsModalComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [
    ModalService,
  ],
  exports: [...COMPONENTS],
  imports: [CoreModule],
  entryComponents: [
    UsePaymentsModalComponent
  ],
})
export class UsePaymentsModalModule {}
