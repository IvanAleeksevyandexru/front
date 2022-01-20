import { NgModule } from '@angular/core';
import { ScreenContainerModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BaseModule } from '../../shared/base.module';
import { RepeatableScreenComponent } from './repeatable-screen.component';
import { CloneButtonModule } from '../../shared/components/clone-button/clone-button.module';

import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { DisclaimerModule } from '../../shared/components/disclaimer/disclaimer.module';

@NgModule({
  declarations: [RepeatableScreenComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ComponentsListModule,
    CloneButtonModule,
    ScreenButtonsModule,
    DisclaimerModule,
    ScrollToModule.forRoot(),
  ],
  exports: [RepeatableScreenComponent],
})
export class RepeatableScreenModule {}
