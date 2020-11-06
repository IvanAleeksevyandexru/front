import { NgModule } from '@angular/core';
import { CommonModalComponent } from './common-modal/common-modal.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { ModalBaseComponent } from './modal-base/modal-base.component';
import { CoreModule } from '../../core/core.module';


const COMPONENTS = [
  CommonModalComponent,
  ModalContainerComponent,
  ModalBaseComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule],
  entryComponents: [
    ModalBaseComponent,
    ModalContainerComponent,
    CommonModalComponent,
  ],
})
export class SharedModalModule {}
