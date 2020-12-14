import { NgModule } from '@angular/core';
import { InfoScreenBodyModule } from './info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './info-screen.component';
import { CoreModule } from '../../core/core.module';
import { BaseModule } from '../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { ActionModule } from '../../shared/directives/action/action.module';

const COMPONENT = [InfoScreenComponent];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CoreModule,
    InfoScreenBodyModule,
    BaseModule,
    ScreenContainerModule,
    ScreenPadModule,
    ActionModule,
  ],
  providers: [],
})
export class InfoScreenModule {}
