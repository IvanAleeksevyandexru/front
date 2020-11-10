import { NgModule } from '@angular/core';
import { ModalService } from '../modal.service';
import { CoreModule } from '../../core/core.module';
import { ConfirmationModalBaseComponent } from './confirmation-modal-base/confirmation-modal-base.component';
import { ConfirmationModalComponent } from './confirmation-modal.component';


const COMPONENTS = [
  ConfirmationModalComponent,
  ConfirmationModalBaseComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [
    ModalService,
  ],
  exports: [...COMPONENTS],
  imports: [CoreModule],
  entryComponents: [
    ConfirmationModalComponent,
    ConfirmationModalBaseComponent
  ],
})
export class ConfirmationModalModule {}
