import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { CoreModule } from '../../core/core.module';
import { ScreenModalService } from './screen-modal.service';


@NgModule({
  declarations: [ScreenModalComponent],
  providers: [
    ScreenModalService,
  ],
  exports: [ScreenModalComponent],
  imports: [CoreModule],
  entryComponents: [
    ScreenModalComponent
  ],
})
export class ScreenModalModule {}
