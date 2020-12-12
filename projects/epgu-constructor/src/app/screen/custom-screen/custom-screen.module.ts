import { NgModule } from '@angular/core';
import { CustomScreenComponent } from './custom-screen.component';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { CoreModule } from '../../core/core.module';
import { BaseModule } from '../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';

const COMPONENTS = [CustomScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule, ComponentsListModule, BaseModule, ScreenContainerModule, ScreenPadModule],
})
export class CustomScreenModule {}
