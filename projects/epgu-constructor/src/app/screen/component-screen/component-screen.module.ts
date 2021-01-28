import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { ComponentsListModule } from '../../component/shared/components/components-list/components-list.module';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentResolverModule } from '../../component/component-resolver/component-resolver.module';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';

// TODO вынести не нужные импорты
@NgModule({
  declarations: [ComponentScreenComponent],
  exports: [ComponentScreenComponent],
  imports: [
    UserInfoLoaderModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
    BaseComponentsModule,
    ComponentResolverModule,
    CommonModule,
  ],
  providers: [EventBusService],
})
export class ComponentScreenModule {}
