import { Type } from '@angular/core';
import { TimeSlotDivorceComponent } from '../component-types/time-slot-divorce/time-slot-divorce.component';
import { TimeSlotMarriageComponent } from '../component-types/time-slot-marriage/time-slot-marriage.component';
import { TimeSlotDoctorComponent } from '../component-types/time-slot-doctor/time-slot-doctor.component';
import { TimeSlotGibddComponent } from '../component-types/time-slot-gibdd/time-slot-gibdd.component';
import { TimeSlotMvdComponent } from '../component-types/time-slot-mvd/time-slot-mvd.component';
import { TimeSlotVaccinationComponent } from '../component-types/time-slot-vaccination/time-slot-vaccination.component';

import { TimeSlotsTypes } from '../../time-slot.const';
import { TimeSlotBirthComponent } from '../component-types/time-slot-birth/time-slot-birth.component';

export type TimeSlotComponentTypes =
  | TimeSlotBirthComponent
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
  BIRTH: TimeSlotBirthComponent,
};
