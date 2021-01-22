import { NgModule } from '@angular/core';
import { ComponentsListModule } from '../../component/shared/components/components-list/components-list.module';
import { BaseModule } from '../../shared/base.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { CustomScreenComponent } from './custom-screen.component';
import { CustomScreenService } from './custom-screen.service';

@NgModule({
  declarations: [CustomScreenComponent],
  exports: [CustomScreenComponent],
  imports: [
    BaseModule,
    ComponentsListModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
  ],
  providers: [
    CustomScreenService,
  ]
})
export class CustomScreenModule {}
