import { NgModule } from '@angular/core';
import { CommonModalComponent } from './common-modal/common-modal.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { ModalBaseComponent } from './modal-base/modal-base.component';
import { BaseUiModule } from '../../base/base-ui.module';

@NgModule({
  declarations: [
    CommonModalComponent,
    ModalContainerComponent,
    ModalBaseComponent,
  ],
  exports: [
    CommonModalComponent,
    ModalContainerComponent,
    ModalBaseComponent,
  ],
  imports: [BaseUiModule],
  entryComponents: [
    ModalBaseComponent,
    ModalContainerComponent,
    CommonModalComponent,
  ],
})
export class SharedModalModule {}
