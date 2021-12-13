import { NgModule } from '@angular/core';
import {
  EventBusService,
  ScreenContainerModule,
  ScreenPadModule,
  ConstructorCheckboxModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';

import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { CheckboxCubeComponent } from './checkbox-cube/checkbox-cube.component';
import { CheckboxCubeContainerComponent } from './checkbox-cube-container/checkbox-cube-container.component';

const COMPONENTS = [CheckboxCubeComponent, CheckboxCubeContainerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService, EventBusService],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    ConstructorCheckboxModule,
  ],
  entryComponents: [CheckboxCubeContainerComponent],
})
export class CheckboxCubeModule {}
