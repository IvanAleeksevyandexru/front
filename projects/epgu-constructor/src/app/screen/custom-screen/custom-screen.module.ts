import { NgModule } from '@angular/core';
import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { BaseModule } from '../../shared/base.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { CustomScreenComponent } from './custom-screen.component';
import { CustomScreenService } from './custom-screen.service';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';
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
    UserInfoLoaderModule,
    ScreenButtonsModule,
  ],
  providers: [
    CustomScreenService,
  ]
})
export class CustomScreenModule {}
