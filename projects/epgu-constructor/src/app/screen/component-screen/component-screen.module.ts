import { NgModule } from '@angular/core';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { TimerModule } from '../../component/component-screen/components/timer/timer.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../shared/base.module';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';

@NgModule({
  declarations: [ComponentScreenComponent],
  exports: [ComponentScreenComponent],
  imports: [
    UserInfoLoaderModule,
    BaseModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
    TimerModule,
    BaseComponentsModule,
    ScreenContainerModule,
    AnswerButtonModule,
    FieldListModule,
    ScreenPadModule,
  ],
})
export class ComponentScreenModule {}
