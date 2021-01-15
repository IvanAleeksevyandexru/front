import { NgModule } from '@angular/core';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CarInfoComponent } from './components/car-info-screen/car-info.component';
import { CarInfoAccidentsPipe } from './pipes/car-accidents.pipe';
import { CarInfoDatePipe } from './pipes/car-date-format.pipe';
import { CarInfoLegalPipe } from './pipes/car-info.pipe';
import { CarInfoOwnerPipe } from './pipes/car-owner-type.pipe';
import { CarInfoStatusPipe } from './pipes/car-status.pipe';
import { CarInfoContainerComponent } from './containers/car-info-screen/car-info-container.component';

const COMPONENTS = [
  CarInfoComponent,
  CarInfoLegalPipe,
  CarInfoStatusPipe,
  CarInfoDatePipe,
  CarInfoOwnerPipe,
  CarInfoAccidentsPipe,
  CarInfoContainerComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService, EventBusService],
  exports: [...COMPONENTS],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule],
})
export class CarInfoModule {}
