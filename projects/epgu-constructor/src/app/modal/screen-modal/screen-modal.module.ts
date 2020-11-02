import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { ModalService } from '../modal.service';
import { CoreModule } from '../../core/core.module';


@NgModule({
  declarations: [ScreenModalComponent],
  providers: [
    ModalService,
  ],
  exports: [ScreenModalComponent],
  imports: [CoreModule],
  entryComponents: [
    ScreenModalComponent
  ],
})
export class ScreenModalModule {}
