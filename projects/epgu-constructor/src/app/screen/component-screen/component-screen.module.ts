import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { TimerModule } from '../../component/component-screen/components/timer/timer.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentResolverModule } from '../../component/component-resolver/component-resolver.module';
import { ComponentWrapperModule } from '../../component/component-screen/shared/component-wrapper.module';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';

@NgModule({
  declarations: [ComponentScreenComponent],
  exports: [ComponentScreenComponent],
  imports: [
    UserInfoLoaderModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
    TimerModule,
    BaseComponentsModule,
    ComponentResolverModule,
    ComponentWrapperModule,
    ScreenPadModule,
    FieldListModule,
    CommonModule,
  ],
  providers: [EventBusService],
})
export class ComponentScreenModule {}
