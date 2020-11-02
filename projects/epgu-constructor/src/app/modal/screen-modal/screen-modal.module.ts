import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { CoreModule } from '../../core/core.module';


@NgModule({
  declarations: [ScreenModalComponent],
  exports: [ScreenModalComponent],
  imports: [CoreModule],
  entryComponents: [
    ScreenModalComponent
  ],
})
export class ScreenModalModule {}
