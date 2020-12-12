import { NgModule } from '@angular/core';
import { CarInfoComponent } from './components/car-info-screen/car-info.component';
import { CarInfoLegalPipe } from './pipes/car-info.pipe';
import { CarInfoStatusPipe } from './pipes/car-status.pipe';
import { CarInfoDatePipe } from './pipes/car-date-format.pipe';
import { CarInfoOwnerPipe } from './pipes/car-owner-type.pipe';
import { CarInfoAccidentsPipe } from './pipes/car-accidents.pipe';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';

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
  providers: [],
  exports: [...COMPONENTS],
  imports: [CoreModule, BaseModule, ScreenContainerModule, ScreenPadModule],
})
export class CarInfoModule {}
