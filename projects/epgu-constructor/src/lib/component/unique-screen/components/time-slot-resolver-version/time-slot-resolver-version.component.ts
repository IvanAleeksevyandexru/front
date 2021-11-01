import { Component } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-time-slot-resolver-version',
  templateUrl: './time-slot-resolver-version.component.html',
})
export class TimeSlotResolverVersionComponent {
  newTimeSlotVersion$ = this.screenService.component$.pipe(pluck('attrs', 'newTimeSlotVersion'));
  constructor(private screenService: ScreenService) {}
}
