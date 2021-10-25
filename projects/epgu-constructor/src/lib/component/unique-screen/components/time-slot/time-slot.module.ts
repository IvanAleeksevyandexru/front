import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import {
  ConstructorCheckboxModule,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { FormsModule } from '@angular/forms';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { CalendarModule } from '../../../../shared/components/calendar/calendar.module';

import { TimeSlotTimeComponent } from './components/calendar/time-slot-time/time-slot-time.component';
import { TimeSlotMonthComponent } from './components/calendar/time-slot-month/time-slot-month.component';
import { TimeSlotCalendarComponent } from './components/calendar/time-slot-calendar/time-slot-calendar.component';
import { TimeSlotAreaComponent } from './components/base/time-slot-area/time-slot-area.component';

import { TimeSlotResolverComponent } from './components/time-slot-resolver/time-slot-resolver.component';
import { TimeSlotScreenComponent } from './components/time-slot-screen/time-slot-screen.component';
import { TimeSlotSmev2Component } from './components/base/time-slot-smev2/time-slot-smev2.component';
import { TimeSlotSmev3Component } from './components/base/time-slot-smev3/time-slot-smev3.component';

import { TimeSlotBookedInfoComponent } from './components/base/time-slot-booked-info/time-slot-booked-info.component';
import { TimeSlotButtonComponent } from './components/base/time-slot-button/time-slot-button.component';
import { TimeSlotErrorComponent } from './components/base/time-slot-error/time-slot-error.component';
import { TimeSlotSmev3ResolverComponent } from './components/time-slot-smev3-resolver/time-slot-smev3-resolver.component';

import { TimeSlotDivorceComponent } from './components/component-types/time-slot-divorce/time-slot-divorce.component';
import { TimeSlotDoctorComponent } from './components/component-types/time-slot-doctor/time-slot-doctor.component';
import { TimeSlotGibddComponent } from './components/component-types/time-slot-gibdd/time-slot-gibdd.component';
import { TimeSlotMarriageComponent } from './components/component-types/time-slot-marriage/time-slot-marriage.component';
import { TimeSlotMvdComponent } from './components/component-types/time-slot-mvd/time-slot-mvd.component';
import { TimeSlotVaccinationComponent } from './components/component-types/time-slot-vaccination/time-slot-vaccination.component';

import { TimeSlotCalendarService } from './services/calendar/time-slot-calendar.service';
import { TimeSlotStateService } from './services/state/time-slot-state.service';
import { Smev2RestApiService } from './services/api/smev2/smev2-rest-api.service';
import { Smev3RestApiService } from './services/api/smev3/smev3-rest-api.service';
import { TimeSlotErrorService } from './services/error/time-slot-error.service';
import { TimeSlotSmev2Service } from './services/smev2/time-slot-smev2.service';
import { TimeSlotSmev3Service } from './services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3StateService } from './services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotBaseScreenComponent } from './components/base/time-slot-base-screen/time-slot-base-screen.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Smev2RestApiInterceptor } from './services/api/smev2/smev2-rest-api.interceptor';
import { Smev3RestApiInterceptor } from './services/api/smev3/smev3-rest-api.interceptor';
// eslint-disable-next-line max-len
import { TimeSlotEmptyErrorComponent } from './components/base/time-slot-error-templates/time-slot-empty-error/time-slot-empty-error.component';
// eslint-disable-next-line max-len
import { TimeSlotCheckboxErrorComponent } from './components/base/time-slot-error-templates/time-slot-checkbox-error/time-slot-checkbox-error.component';

@NgModule({
  declarations: [
    TimeSlotBaseScreenComponent,
    TimeSlotAreaComponent,
    TimeSlotBookedInfoComponent,
    TimeSlotButtonComponent,
    TimeSlotErrorComponent,
    TimeSlotSmev2Component,
    TimeSlotSmev3Component,
    TimeSlotCalendarComponent,
    TimeSlotMonthComponent,
    TimeSlotTimeComponent,
    TimeSlotResolverComponent,
    TimeSlotScreenComponent,
    TimeSlotSmev3ResolverComponent,
    TimeSlotDivorceComponent,
    TimeSlotDoctorComponent,
    TimeSlotGibddComponent,
    TimeSlotMarriageComponent,
    TimeSlotMvdComponent,
    TimeSlotVaccinationComponent,
    TimeSlotBaseScreenComponent,
    TimeSlotEmptyErrorComponent,
    TimeSlotCheckboxErrorComponent,
  ],
  exports: [
    TimeSlotResolverComponent,
    TimeSlotDivorceComponent,
    TimeSlotDoctorComponent,
    TimeSlotGibddComponent,
    TimeSlotMarriageComponent,
    TimeSlotMvdComponent,
    TimeSlotVaccinationComponent,
    TimeSlotScreenComponent,
    TimeSlotSmev3Component,
    TimeSlotBookedInfoComponent,
    TimeSlotButtonComponent,
    TimeSlotBaseScreenComponent,
    TimeSlotEmptyErrorComponent,
    TimeSlotCheckboxErrorComponent,
  ],
  providers: [
    Smev2RestApiService,
    Smev3RestApiService,
    TimeSlotStateService,
    TimeSlotCalendarService,
    TimeSlotErrorService,
    TimeSlotSmev2Service,
    TimeSlotSmev3Service,
    TimeSlotSmev3StateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Smev2RestApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Smev3RestApiInterceptor,
      multi: true,
    },
  ],
  imports: [
    CalendarModule,
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    FormsModule,
    ScreenButtonsModule,
    ConstructorCheckboxModule,
  ],
  entryComponents: [
    TimeSlotResolverComponent,
    TimeSlotDivorceComponent,
    TimeSlotDoctorComponent,
    TimeSlotGibddComponent,
    TimeSlotMarriageComponent,
    TimeSlotMvdComponent,
    TimeSlotVaccinationComponent,
    TimeSlotScreenComponent,
    TimeSlotSmev3Component,
    TimeSlotEmptyErrorComponent,
    TimeSlotCheckboxErrorComponent,
  ],
})
export class TimeSlotModule {}
