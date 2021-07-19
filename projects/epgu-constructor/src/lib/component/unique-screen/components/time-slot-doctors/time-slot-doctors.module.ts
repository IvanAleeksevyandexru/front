import { NgModule } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import {
  ConstructorLookupModule,
  EventBusService,
  ScreenContainerModule,
  ScreenPadModule
} from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { TimeSlotDoctorsContainerComponent } from './time-slot-doctors-container/time-slot-doctors-container.component';
import { TimeSlotDoctorsComponent } from './time-slot-doctors.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

const COMPONENTS = [
  TimeSlotDoctorsContainerComponent,
  TimeSlotDoctorsComponent,
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
    ConstructorLookupModule,
    ScreenButtonsModule,
    DefaultUniqueScreenWrapperModule,
  ],
  entryComponents: [TimeSlotDoctorsContainerComponent]
})
export class TimeSlotDoctorsModule { }
