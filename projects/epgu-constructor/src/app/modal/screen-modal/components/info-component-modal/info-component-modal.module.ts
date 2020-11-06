import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { InfoScreenBodyModule } from '../../../../screen/info-screen/info-screen-body/info-screen-body.module';
import { InfoComponentModalComponent } from './info-component-modal.component';

@NgModule({
  declarations: [InfoComponentModalComponent],
  exports: [InfoComponentModalComponent],
  imports: [CoreModule, SharedModule, InfoScreenBodyModule],
})
export class InfoComponentModalModule {}
