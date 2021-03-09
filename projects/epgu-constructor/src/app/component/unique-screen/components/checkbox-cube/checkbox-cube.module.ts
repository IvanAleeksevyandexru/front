import { NgModule } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { CheckboxCubeComponent } from './checkbox-cube/checkbox-cube.component';
import { CheckboxCubeContainerComponent } from './checkbox-cube-container/checkbox-cube-container.component';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';

const COMPONENTS = [
  CheckboxCubeComponent,
  CheckboxCubeContainerComponent,
];

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
    ConstructorCheckboxModule],
  entryComponents: [CheckboxCubeContainerComponent]
})
export class CheckboxCubeModule {
}
