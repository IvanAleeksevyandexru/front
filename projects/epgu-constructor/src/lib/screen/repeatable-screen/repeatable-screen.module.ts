import { NgModule } from '@angular/core';
import { BaseModule } from '../../shared/base.module';
import { RepeatableScreenComponent } from './repeatable-screen.component';
import { CloneButtonModule } from '../../shared/components/clone-button/clone-button.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

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
    ScrollToModule.forRoot(),
  ],
  exports: [RepeatableScreenComponent],
  entryComponents: [RepeatableScreenComponent]
})
export class RepeatableScreenModule {}
