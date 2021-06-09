import { NgModule } from '@angular/core';
import { InfoScreenBodyModule } from '../../../../screen/info-screen/info-screen-body/info-screen-body.module';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [InfoComponentModalComponent],
  exports: [InfoComponentModalComponent],
  imports: [BaseModule, InfoScreenBodyModule],
  entryComponents: [InfoComponentModalComponent]
})
export class InfoComponentModalModule {}
