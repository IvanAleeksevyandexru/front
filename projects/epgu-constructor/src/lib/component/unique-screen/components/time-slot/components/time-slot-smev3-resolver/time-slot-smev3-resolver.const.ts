import { TimeSlotDivorceComponent } from '../component-types/time-slot-divorce/time-slot-divorce.component';
import { TimeSlotMarriageComponent } from '../component-types/time-slot-marriage/time-slot-marriage.component';
import { TimeSlotDoctorComponent } from '../component-types/time-slot-doctor/time-slot-doctor.component';
import { TimeSlotGibddComponent } from '../component-types/time-slot-gibdd/time-slot-gibdd.component';
import { TimeSlotMvdComponent } from '../component-types/time-slot-mvd/time-slot-mvd.component';
import { TimeSlotVaccinationComponent } from '../component-types/time-slot-vaccination/time-slot-vaccination.component';

import { Type } from '@angular/core';
import { TimeSlotsTypes } from '../../time-slot.const';

export type TimeSlotComponentTypes =
  | TimeSlotDivorceComponent
  | TimeSlotMarriageComponent
  | TimeSlotDoctorComponent
  | TimeSlotGibddComponent
  | TimeSlotMvdComponent
  | TimeSlotVaccinationComponent;

export const TIMESLOT_COMPONENTS: Partial<Record<TimeSlotsTypes, Type<TimeSlotComponentTypes>>> = {
  BRAK: TimeSlotMarriageComponent,
  RAZBRAK: TimeSlotDivorceComponent,
  GIBDD: TimeSlotGibddComponent,
  MVD: TimeSlotMvdComponent,
  DOCTOR: TimeSlotDoctorComponent,
  VACCINATION: TimeSlotVaccinationComponent,
};
