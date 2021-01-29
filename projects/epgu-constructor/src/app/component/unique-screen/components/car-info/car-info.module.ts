import { NgModule } from '@angular/core';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CarInfoComponent } from './components/car-info-screen/car-info.component';
import { CarInfoContainerComponent } from './containers/car-info-screen/car-info-container.component';
import { ExpansionLinkComponent } from './components/expansion-link/expansion-link.component';
import { DefaultValuePipe } from './pipes/default-value.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { ErrorTemplatePipe } from './pipes/error-template.pipe';
import { EnginePowerPipe } from './pipes/engine-power.pipe';
import { ModelMarkNamePipe } from './pipes/model-mark-name.pipe';
import { CarDatePipe } from './pipes/car-date.pipe';

const COMPONENTS = [
  CarInfoComponent,
  CarInfoContainerComponent,
  ExpansionLinkComponent,
  YesNoPipe,
  ErrorTemplatePipe,
  EnginePowerPipe,
  ModelMarkNamePipe,
  CarDatePipe,
  DefaultValuePipe
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService, EventBusService],
  exports: [...COMPONENTS],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule],
  entryComponents: [CarInfoContainerComponent]
})
export class CarInfoModule {}
