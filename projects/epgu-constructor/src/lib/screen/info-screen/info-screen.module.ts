import { NgModule } from '@angular/core';
import { ScreenContainerModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { SocialShareModule } from '@epgu/ui/components/social-share';
import { InfoScreenBodyModule } from './info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './info-screen.component';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';

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
    SocialShareModule,
  ],
  providers: [],
})
export class InfoScreenModule {}
