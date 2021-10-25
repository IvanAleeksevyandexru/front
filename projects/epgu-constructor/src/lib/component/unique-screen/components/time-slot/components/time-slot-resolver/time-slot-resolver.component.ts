import { ChangeDetectionStrategy, Component } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { ScreenService } from '../../../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-time-slot-resolver',
  templateUrl: './time-slot-resolver.component.html',
  styleUrls: ['./time-slot-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotResolverComponent {
  isSmev2$ = this.screenService.component$.pipe(pluck('attrs', 'isSmev2'));
  constructor(private screenService: ScreenService) {}
}
