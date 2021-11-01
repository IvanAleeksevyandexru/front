import { NgModule } from '@angular/core';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { TimeSlotModule } from '../time-slot/time-slot.module';
import { TimeSlotResolverVersionComponent } from './time-slot-resolver-version.component';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [TimeSlotResolverVersionComponent],
  providers: [],
  exports: [TimeSlotResolverVersionComponent],
  imports: [BaseModule, TimeSlotsModule, TimeSlotModule],
  entryComponents: [TimeSlotResolverVersionComponent],
})
export class TimeSlotResolverVersionModule {}
