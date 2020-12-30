import { NgModule } from '@angular/core';
import { CustomScreenComponent } from './custom-screen.component';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [CustomScreenComponent],
  exports: [CustomScreenComponent],
  imports: [
    BaseModule,
    ComponentsListModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule
  ],
})
export class CustomScreenModule {}
