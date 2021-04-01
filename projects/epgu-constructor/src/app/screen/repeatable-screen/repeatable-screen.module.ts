import { NgModule } from '@angular/core';
import { BaseModule } from '../../shared/base.module';
import { RepeatableScreenComponent } from './repeatable-screen.component';
import { CloneButtonModule } from '../../shared/components/clone-button/clone-button.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';

@NgModule({
  declarations: [RepeatableScreenComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ComponentsListModule,
    CloneButtonModule,
  ],
  exports: [RepeatableScreenComponent],
  entryComponents: [RepeatableScreenComponent]
})
export class RepeatableScreenModule {}
