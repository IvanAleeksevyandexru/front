import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { CoreModule } from '../../core/core.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { TimerModule } from '../../component/component-screen/components/timer/timer.module';
import { BaseModule } from '../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { ActionModule } from '../../shared/directives/action/action.module';

@NgModule({
  declarations: [ComponentScreenComponent],
  exports: [ComponentScreenComponent],
  imports: [
    CoreModule,
    SharedModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
    TimerModule,
    BaseModule,
    ScreenContainerModule,
    ScreenPadModule,
    AnswerButtonModule,
    FieldListModule,
    ActionModule,
  ],
  providers: [],
})
export class ComponentScreenModule {}
