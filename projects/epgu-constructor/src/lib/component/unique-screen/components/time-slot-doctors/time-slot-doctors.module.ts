import { NgModule } from '@angular/core';
import {
  ConstructorCheckboxModule,
  ConstructorLookupModule,
  EventBusService,
  ScreenContainerModule,
  ScreenPadModule,
  TimeCalendarModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { TimeSlotDoctorsContainerComponent } from './time-slot-doctors-container/time-slot-doctors-container.component';
import { TimeSlotDoctorsComponent } from './time-slot-doctors.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { TimeSlotDoctorService } from './time-slot-doctor.service';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefResourceInterceptor } from '../../../../core/interceptor/ref-resource/ref-resource.interceptor';
import { RefServiceOrSpecsInterceptor } from '../../../../core/interceptor/ref-service-or-specs/ref-service-or-specs.interceptor';

const COMPONENTS = [TimeSlotDoctorsContainerComponent, TimeSlotDoctorsComponent];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [
    ScreenService,
    EventBusService,
    TimeSlotDoctorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefResourceInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefServiceOrSpecsInterceptor,
      multi: true,
    },
  ],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ConstructorLookupModule,
    ScreenButtonsModule,
    DefaultUniqueScreenWrapperModule,
    TimeCalendarModule,
    DisclaimerModule,
    ConstructorCheckboxModule,
  ],
  entryComponents: [TimeSlotDoctorsContainerComponent],
})
export class TimeSlotDoctorsModule {}
