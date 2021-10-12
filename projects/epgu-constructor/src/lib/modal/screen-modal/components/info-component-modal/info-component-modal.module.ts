import { NgModule } from '@angular/core';
import { InfoScreenBodyModule } from '../../../../screen/info-screen/info-screen-body/info-screen-body.module';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { BaseModule } from '../../../../shared/base.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [InfoComponentModalComponent],
  exports: [InfoComponentModalComponent],
  imports: [BaseModule, InfoScreenBodyModule, ScreenButtonsModule],
  entryComponents: [InfoComponentModalComponent],
})
export class InfoComponentModalModule {}
