import { NgModule } from '@angular/core';
import { InfoScreenBodyModule } from './info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './info-screen.component';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [InfoScreenComponent],
  exports: [InfoScreenComponent],
  imports: [
    BaseModule,
    InfoScreenBodyModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ScreenButtonsModule,
  ],
  providers: [],
})
export class InfoScreenModule {}
