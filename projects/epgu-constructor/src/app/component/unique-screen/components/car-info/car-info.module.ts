import { NgModule } from '@angular/core';
import { CarInfoComponent } from './components/car-info-screen/car-info.component';
import { CarInfoLegalPipe } from './pipes/car-info.pipe';
import { CarInfoStatusPipe } from './pipes/car-status.pipe';
import { CarInfoDatePipe } from './pipes/car-date-format.pipe';
import { CarInfoOwnerPipe } from './pipes/car-owner-type.pipe';
import { CarInfoAccidentsPipe } from './pipes/car-accidents.pipe';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';

const COMPONENTS = [
  CarInfoComponent,
  CarInfoLegalPipe,
  CarInfoStatusPipe,
  CarInfoDatePipe,
  CarInfoOwnerPipe,
  CarInfoAccidentsPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService],
  exports: [...COMPONENTS],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule],
})
export class CarInfoModule {}
