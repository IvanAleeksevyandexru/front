import { NgModule } from '@angular/core';
import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { BaseModule } from '../../shared/base.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CustomScreenComponent } from './custom-screen.component';
import { CustomScreenService } from './custom-screen.service';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [CustomScreenComponent],
  exports: [CustomScreenComponent],
  imports: [
    BaseModule,
    ComponentsListModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ScreenButtonsModule,
  ],
  providers: [
    CustomScreenService,
  ]
})
export class CustomScreenModule {}
