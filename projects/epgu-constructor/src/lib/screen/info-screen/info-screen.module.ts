import { NgModule } from '@angular/core';
import { InfoScreenBodyModule } from './info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './info-screen.component';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { SocialShareModule } from '@epgu/ui/components/social-share';

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
