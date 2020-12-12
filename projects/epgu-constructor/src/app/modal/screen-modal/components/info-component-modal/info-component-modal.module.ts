import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { InfoScreenBodyModule } from '../../../../screen/info-screen/info-screen-body/info-screen-body.module';
import { InfoComponentModalComponent } from './info-component-modal.component';
import { ActionModule } from '../../../../shared/directives/action/action.module';

@NgModule({
  declarations: [InfoComponentModalComponent],
  exports: [InfoComponentModalComponent],
  imports: [CoreModule, SharedModule, InfoScreenBodyModule, ActionModule],
})
export class InfoComponentModalModule {}
