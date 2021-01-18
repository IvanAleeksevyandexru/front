import { NgModule } from '@angular/core';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { TimerModule } from '../../component/component-screen/components/timer/timer.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../shared/base.module';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { ActionModule } from '../../shared/directives/action/action.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentResolverModule } from '../../component/component-resolver/component-resolver.module';

@NgModule({
  declarations: [ComponentScreenComponent],
  exports: [ComponentScreenComponent],
  imports: [
    BaseModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
    TimerModule,
    BaseComponentsModule,
    ScreenContainerModule,
    AnswerButtonModule,
    FieldListModule,
    ScreenPadModule,
    ActionModule,
    ComponentResolverModule
  ],
  providers: [EventBusService],
})
export class ComponentScreenModule {}
